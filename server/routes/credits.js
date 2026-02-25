import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import AppConfig from "../models/AppConfig.js";

const router = express.Router();

/**
 * @route   GET /api/credits
 * @desc    Get user's photoshoot credits
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    // Always fetch fresh data from database (no caching)
    const user = await User.findById(req.user._id).select(
      "name totalCredits usedPhotoshootCredits usedMarketingCredits subscriptionPlan subscriptionExpiresAt originalPlanCredits creditHistory",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Set cache-control headers to prevent client-side caching
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    // Calculate remaining credits and usage transparency
    let totalCreditsAvailable = user.totalCredits;

    // If user doesn't have totalCredits (old users), use free tier credits as default
    if (!totalCreditsAvailable && totalCreditsAvailable !== 0) {
      const config = await AppConfig.getConfig();
      totalCreditsAvailable = config.freeTierTotalCredits || 100;

      // Update user with unified credits if they don't have them
      if (!user.totalCredits && user.totalCredits !== 0) {
        user.totalCredits = totalCreditsAvailable;
        user.usedPhotoshootCredits = user.usedPhotoshootCredits || 0;
        user.usedMarketingCredits = user.usedMarketingCredits || 0;
        await user.save();
      }
    }

    const usedTotalCredits =
      (user.usedPhotoshootCredits || 0) + (user.usedMarketingCredits || 0);
    const remainingCredits = Math.max(
      0,
      totalCreditsAvailable - usedTotalCredits,
    );

    res.status(200).json({
      success: true,
      // Unified credit system
      totalCredits: totalCreditsAvailable,
      usedPhotoshootCredits: user.usedPhotoshootCredits || 0,
      usedMarketingCredits: user.usedMarketingCredits || 0,
      remainingCredits: remainingCredits,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      userName: user.name || null,
      email: user.email || null,
      originalPlanCredits: user.originalPlanCredits,
    });
  } catch (error) {
    console.error("Get credits error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   GET /api/credits/history
 * @desc    Get user's credit change history
 * @access  Private
 */
router.get("/history", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("creditHistory");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      history: user.creditHistory || [],
    });
  } catch (error) {
    console.error("Get credit history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   POST /api/credits/check
 * @desc    Check if user has enough credits for generation (photoshoot or marketing)
 * @access  Private
 * @note    Uses unified credit system - photoshoot costs 20, marketing costs 5
 */
router.post("/check", protect, async (req, res) => {
  try {
    const { type, imageQuality } = req.body; // 'photoshoot' or 'marketing', imageQuality: 'hd' | '4k'

    // Get configurable credits per generation
    const config = await AppConfig.getConfig();
    let CREDITS_PER_GENERATION;
    if (type === "marketing") {
      CREDITS_PER_GENERATION = config.creditsPerMarketingGeneration;
    } else if (imageQuality === '4k') {
      CREDITS_PER_GENERATION = config.creditsPerPhotoshoot4KGeneration;
    } else {
      CREDITS_PER_GENERATION = config.creditsPerPhotoshootGeneration;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Use unified credit system
    const totalCreditsAvailable = user.totalCredits || 0;
    const usedTotalCredits =
      (user.usedPhotoshootCredits || 0) + (user.usedMarketingCredits || 0);
    const remainingCredits = Math.max(
      0,
      totalCreditsAvailable - usedTotalCredits,
    );

    if (remainingCredits < CREDITS_PER_GENERATION) {
      const creditType =
        type === "marketing" ? "marketing poster" : "photoshoot";
      return res.status(200).json({
        success: false,
        hasCredits: false,
        remainingCredits: remainingCredits,
        totalCredits: totalCreditsAvailable,
        usedPhotoshootCredits: user.usedPhotoshootCredits || 0,
        usedMarketingCredits: user.usedMarketingCredits || 0,
        requiredCredits: CREDITS_PER_GENERATION,
        message: `You need ${CREDITS_PER_GENERATION} credits for ${creditType} generation. You have ${remainingCredits} credits remaining. Please upgrade your plan.`,
      });
    }

    res.status(200).json({
      success: true,
      hasCredits: true,
      remainingCredits: remainingCredits,
      totalCredits: totalCreditsAvailable,
      usedPhotoshootCredits: user.usedPhotoshootCredits || 0,
      usedMarketingCredits: user.usedMarketingCredits || 0,
      requiredCredits: CREDITS_PER_GENERATION,
    });
  } catch (error) {
    console.error("Check credits error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   POST /api/credits/deduct
 * @desc    Deduct credits after generation (photoshoot or marketing poster)
 * @access  Private
 * @note    Uses unified credit system - photoshoot costs 20, marketing costs 5
 */
router.post("/deduct", protect, async (req, res) => {
  try {
    const { type, imageQuality } = req.body; // 'photoshoot' or 'marketing', imageQuality: 'hd' | '4k'

    // Get configurable credits per generation
    const config = await AppConfig.getConfig();
    let CREDITS_PER_GENERATION;
    if (type === "marketing") {
      CREDITS_PER_GENERATION = config.creditsPerMarketingGeneration;
    } else if (imageQuality === '4k') {
      CREDITS_PER_GENERATION = config.creditsPerPhotoshoot4KGeneration;
    } else {
      CREDITS_PER_GENERATION = config.creditsPerPhotoshootGeneration;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Use unified credit system
    const totalCreditsAvailable = user.totalCredits || 0;
    const usedTotalCredits =
      (user.usedPhotoshootCredits || 0) + (user.usedMarketingCredits || 0);
    const remainingCredits = Math.max(
      0,
      totalCreditsAvailable - usedTotalCredits,
    );

    if (remainingCredits < CREDITS_PER_GENERATION) {
      const creditType =
        type === "marketing" ? "marketing poster" : "photoshoot";
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. You need ${CREDITS_PER_GENERATION} credits for ${creditType} generation. You have ${remainingCredits} credits remaining.`,
      });
    }

    // Update unified credit usage
    if (type === "marketing") {
      user.usedMarketingCredits =
        (user.usedMarketingCredits || 0) + CREDITS_PER_GENERATION;
    } else {
      user.usedPhotoshootCredits =
        (user.usedPhotoshootCredits || 0) + CREDITS_PER_GENERATION;
    }

    // Add to credit history
    const newTotalUsedCredits =
      (user.usedPhotoshootCredits || 0) + (user.usedMarketingCredits || 0);
    const newRemainingCredits = Math.max(
      0,
      totalCreditsAvailable - newTotalUsedCredits,
    );

    user.creditHistory = user.creditHistory || [];
    user.creditHistory.push({
      date: new Date(),
      action: "usage",
      planName: user.subscriptionPlan || "Free Tier",
      totalCredits: {
        previous: totalCreditsAvailable,
        new: totalCreditsAvailable,
        change: 0, // Total credits don't change on usage
      },
      usedPhotoshootCredits: {
        previous:
          user.usedPhotoshootCredits -
          (type === "photoshoot" ? CREDITS_PER_GENERATION : 0),
        new: user.usedPhotoshootCredits,
        change: type === "photoshoot" ? CREDITS_PER_GENERATION : 0,
      },
      usedMarketingCredits: {
        previous:
          user.usedMarketingCredits -
          (type === "marketing" ? CREDITS_PER_GENERATION : 0),
        new: user.usedMarketingCredits,
        change: type === "marketing" ? CREDITS_PER_GENERATION : 0,
      },
      reason: `${type === "marketing" ? "Marketing poster" : "Photoshoot"} generation - ${CREDITS_PER_GENERATION} credits deducted`,
    });

    await user.save();

    // Calculate new remaining credits
    const finalUsedTotalCredits =
      (user.usedPhotoshootCredits || 0) + (user.usedMarketingCredits || 0);
    const finalRemainingCredits = Math.max(
      0,
      totalCreditsAvailable - finalUsedTotalCredits,
    );

    res.status(200).json({
      success: true,
      totalCredits: totalCreditsAvailable,
      usedPhotoshootCredits: user.usedPhotoshootCredits || 0,
      usedMarketingCredits: user.usedMarketingCredits || 0,
      remainingCredits: finalRemainingCredits,
      // Legacy compatibility
      photoshootCredits: Math.max(
        0,
        (user.photoshootCredits || 0) - (user.usedPhotoshootCredits || 0),
      ),
      marketingPosterCredits: Math.max(
        0,
        (user.marketingPosterCredits || 0) - (user.usedMarketingCredits || 0),
      ),
      message: `${CREDITS_PER_GENERATION} credits deducted successfully for ${type === "marketing" ? "marketing poster" : "photoshoot"} generation`,
    });
  } catch (error) {
    console.error("Deduct credits error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
