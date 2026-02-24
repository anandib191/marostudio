import express from "express";
import PricePlan, { DEFAULT_PLANS } from "../models/PricePlan.js";

const router = express.Router();

/**
 * @route   GET /api/price-plans
 * @desc    Get price plans (public, used by PricingPage)
 */
router.get("/", async (req, res) => {
  try {
    // Set CORS headers explicitly
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Cache-Control, Pragma",
    );

    // Add cache-busting headers for real-time updates
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const plans = await PricePlan.find().sort({ createdAt: 1 });
    console.log(
      `Fetched ${plans.length} plans from database at ${new Date().toISOString()}`,
    );

    // Log detailed plan data for debugging
    if (plans.length > 0) {
      console.log(
        "Database plans:",
        plans.map((p) => ({
          name: p.name,
          price: p.price,
          totalCredits: p.totalCredits,
          isPopular: p.isPopular,
        })),
      );
    }

    // If no plans exist, return default plans
    if (plans.length === 0) {
      console.log("No plans in database, returning DEFAULT_PLANS");
      console.log(
        "DEFAULT_PLANS:",
        DEFAULT_PLANS.map((p) => ({
          name: p.name,
          price: p.price,
          totalCredits: p.totalCredits,
        })),
      );
      return res.status(200).json({ success: true, plans: DEFAULT_PLANS });
    }

    // Ensure plans have required fields
    const validPlans = plans.map((plan) => ({
      name: plan.name || "",
      price: plan.price || "0",
      yearlyPrice: plan.yearlyPrice || "0",
      description: plan.description || "",
      features: Array.isArray(plan.features) ? plan.features : [],
      isPopular: plan.isPopular || false,
      totalCredits: plan.totalCredits || 0,
    }));

    console.log(`Returning ${validPlans.length} price plans`);
    res.status(200).json({ success: true, plans: validPlans });
  } catch (error) {
    console.error("Get price plans error:", error);
    // Return default plans on error as fallback
    res.status(200).json({
      success: true,
      plans: DEFAULT_PLANS,
      error: "Database error, using default plans",
    });
  }
});

// Handle OPTIONS request for CORS preflight
router.options("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Cache-Control, Pragma",
  );
  res.status(204).end();
});

export default router;
