import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import PricePlan from "../models/PricePlan.js";
import PromoCode from "../models/PromoCode.js";
import logger from "../utils/logger.js";

const router = express.Router();

// Initialize Razorpay lazily (only when needed)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.",
    );
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * @route   POST /api/payment/validate-promo
 * @desc    Validate a promo code for a specific plan
 * @access  Protected
 */
router.post("/validate-promo", protect, async (req, res) => {
  try {
    const { code, planName, billingPeriod } = req.body;
    const userId = req.user._id.toString();

    if (!code || !planName) {
      return res.status(400).json({ success: false, message: "Promo code and plan name are required" });
    }

    const promoCode = await PromoCode.findOne({ code: code.trim().toUpperCase() });
    if (!promoCode) {
      return res.status(400).json({ success: false, message: "Invalid promo code" });
    }

    if (!promoCode.isActive) {
      return res.status(400).json({ success: false, message: "This promo code is no longer active" });
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: "This promo code has expired" });
    }

    if (promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ success: false, message: "This promo code has reached its maximum usage limit" });
    }

    // Check if user already used this code
    const alreadyUsed = promoCode.usedBy.some((u) => u.userId?.toString() === userId);
    if (alreadyUsed) {
      return res.status(400).json({ success: false, message: "You have already used this promo code" });
    }

    // Find the applicable plan discount
    const planDiscount = promoCode.applicablePlans.find(
      (p) => p.planName.toLowerCase() === planName.toLowerCase()
    );
    if (!planDiscount) {
      return res.status(400).json({ success: false, message: "This promo code is not applicable for the selected plan" });
    }

    // Get plan price to calculate discount
    const plan = await PricePlan.findOne({
      $or: [{ name: planName }, { name: new RegExp(`^${planName}$`, "i") }],
    });
    if (!plan) {
      return res.status(400).json({ success: false, message: "Plan not found" });
    }

    const price = billingPeriod === "yearly"
      ? parseFloat(plan.yearlyPrice) * 12
      : parseFloat(plan.price);

    let discountAmount = 0;
    if (promoCode.discountType === "percentage") {
      discountAmount = Math.round((price * planDiscount.discountValue) / 100);
    } else {
      discountAmount = Math.min(planDiscount.discountValue, price);
    }

    const finalAmount = Math.max(0, price - discountAmount);

    res.status(200).json({
      success: true,
      promoCode: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: planDiscount.discountValue,
      originalAmount: price,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    logger.error("Validate promo code error:", error);
    res.status(500).json({ success: false, message: "Failed to validate promo code" });
  }
});

/**
 * @route   POST /api/payment/create-order
 * @desc    Create a Razorpay order
 * @access  Protected (requires authentication)
 */
router.post(
  "/create-order",
  protect,
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("planName").notEmpty().withMessage("Plan name is required"),
    body("billingPeriod")
      .isIn(["monthly", "yearly"])
      .withMessage("Billing period must be monthly or yearly"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const { amount, planName, billingPeriod, promoCode: promoCodeStr } = req.body;
      const userId = req.user._id.toString();

      // Credit threshold check: block purchase if user has >= 200 remaining credits
      const CREDIT_PURCHASE_THRESHOLD = 500;
      const user = await User.findById(userId);
      if (user) {
        const totalCreditsAvailable = user.totalCredits || 0;
        const usedTotalCredits =
          (user.usedPhotoshootCredits || 0) + (user.usedMarketingCredits || 0);
        const remainingCredits = Math.max(0, totalCreditsAvailable - usedTotalCredits);

        if (remainingCredits >= CREDIT_PURCHASE_THRESHOLD) {
          return res.status(400).json({
            success: false,
            message: `You still have ${remainingCredits} credits remaining. You can purchase a new plan when your credits drop below ${CREDIT_PURCHASE_THRESHOLD}.`,
          });
        }
      }

      // Frontend already sends the discounted amount (validated via /validate-promo).
      // We just pass the promo code through to Razorpay notes for reference.
      const finalAmount = parseFloat(amount);
      const validatedPromoCode = promoCodeStr ? promoCodeStr.trim().toUpperCase() : null;

      // Convert amount to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = Math.round(finalAmount * 100);

      // Get Razorpay instance
      const razorpay = getRazorpayInstance();

      // Create order options
      // Receipt must be max 40 characters, so we use a shorter format
      const timestamp = Date.now().toString().slice(-10); // Last 10 digits of timestamp
      const userIdShort = userId.slice(-8); // Last 8 characters of userId
      const receipt = `NGP_${timestamp}_${userIdShort}`; // Max length: 3 + 1 + 10 + 1 + 8 = 23 chars

      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt,
        notes: {
          userId: userId,
          planName: planName,
          billingPeriod: billingPeriod,
          userEmail: req.user.email,
          promoCode: validatedPromoCode || undefined,
        },
      };

      // Create order
      const order = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
        },
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      logger.error("Error creating Razorpay order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment order",
        error: error.message,
      });
    }
  },
);

/**
 * @route   POST /api/payment/verify-payment
 * @desc    Verify Razorpay payment signature
 * @access  Protected (requires authentication)
 */
router.post(
  "/verify-payment",
  protect,
  [
    body("razorpay_order_id").notEmpty().withMessage("Order ID is required"),
    body("razorpay_payment_id")
      .notEmpty()
      .withMessage("Payment ID is required"),
    body("razorpay_signature").notEmpty().withMessage("Signature is required"),
    body("planName").notEmpty().withMessage("Plan name is required"),
    body("billingPeriod")
      .isIn(["monthly", "yearly"])
      .withMessage("Billing period must be monthly or yearly"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errors.array(),
        });
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planName,
        billingPeriod,
        amount,
        promoCode: promoCodeStr,
        promoDiscount: promoDiscountAmount,
        originalAmount,
      } = req.body;
      const userId = req.user._id.toString();

      // Create signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

      // Verify signature
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed: Invalid signature",
        });
      }

      // Payment verified successfully
      // Update user subscription
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get plan details to update credits (case-insensitive search)
      const plan = await PricePlan.findOne({
        $or: [{ name: planName }, { name: new RegExp(`^${planName}$`, "i") }],
      });
      console.log(
        "Found plan:",
        plan ? plan.name : "NOT FOUND",
        "Credits:",
        plan ? { totalCredits: plan.totalCredits } : "N/A",
      );
      if (plan) {
        // Update subscription plan
        user.subscriptionPlan = planName;
        user.subscriptionBillingPeriod = billingPeriod;

        // Set purchase date (current date/time)
        const purchaseDate = new Date();
        user.subscriptionPurchasedAt = purchaseDate;

        // Calculate expiration date based on billing period
        const expirationDate = new Date();
        if (billingPeriod === "monthly") {
          // Add 1 month to current date
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        } else if (billingPeriod === "yearly") {
          // Add exactly 1 year (365 days) to current date
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        } else {
          // Default to monthly if billingPeriod is invalid
          logger.warn(
            `Invalid billingPeriod: ${billingPeriod}, defaulting to monthly`,
          );
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        }
        user.subscriptionExpiresAt = expirationDate;

        // Calculate credits based on billing period using unified system
        // Monthly plans: credits as per plan (monthly credits)
        // Yearly plans: credits * 12 (yearly credits for full year)
        const monthlyTotalCredits = plan.totalCredits || 0;

        let totalCredits;
        if (billingPeriod === "yearly") {
          // Yearly plan: multiply monthly credits by 12
          totalCredits = monthlyTotalCredits * 12;
        } else {
          // Monthly plan: use monthly credits as is
          totalCredits = monthlyTotalCredits;
        }

        // Log expiry calculation for debugging
        logger.info("Subscription expiry set:", {
          email: user.email,
          planName: planName,
          billingPeriod: billingPeriod,
          purchaseDate: purchaseDate.toISOString(),
          expiryDate: expirationDate.toISOString(),
          daysUntilExpiry: Math.round(
            (expirationDate - purchaseDate) / (1000 * 60 * 60 * 24),
          ),
          monthlyCredits: monthlyTotalCredits,
          totalCredits: totalCredits,
        });

        // Add new plan credits to existing remaining credits (carry over)
        const oldTotalCredits = user.totalCredits || 0;
        const oldUsedPhotoshootCredits = user.usedPhotoshootCredits || 0;
        const oldUsedMarketingCredits = user.usedMarketingCredits || 0;

        // Calculate remaining credits from old plan
        const oldRemainingCredits = Math.max(0, oldTotalCredits - oldUsedPhotoshootCredits - oldUsedMarketingCredits);

        // New total = new plan credits + old remaining credits
        const newTotalCredits = totalCredits + oldRemainingCredits;

        user.totalCredits = newTotalCredits;
        user.usedPhotoshootCredits = 0; // Reset usage for new plan
        user.usedMarketingCredits = 0; // Reset usage for new plan

        // Store original plan credits for accurate used credits calculation
        user.originalPlanCredits = newTotalCredits;

        // Log credit purchase in history
        if (!user.creditHistory) {
          user.creditHistory = [];
        }
        user.creditHistory.push({
          date: new Date(),
          action: "purchase",
          planName: planName,
          totalCredits: {
            previous: oldTotalCredits,
            new: newTotalCredits,
            change: newTotalCredits - oldTotalCredits,
          },
          usedPhotoshootCredits: {
            previous: oldUsedPhotoshootCredits,
            new: 0, // Reset to 0 for new plan
            change: -oldUsedPhotoshootCredits,
          },
          usedMarketingCredits: {
            previous: oldUsedMarketingCredits,
            new: 0, // Reset to 0 for new plan
            change: -oldUsedMarketingCredits,
          },
          billingPeriod: billingPeriod,
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          amount: amount || null,
          promoCode: promoCodeStr || null,
          promoDiscount: promoDiscountAmount || null,
          originalAmount: originalAmount || null,
          reason: promoCodeStr
            ? `Purchased ${planName} plan (${billingPeriod}) with promo code ${promoCodeStr} - Discount ₹${promoDiscountAmount || 0}`
            : `Purchased ${planName} plan (${billingPeriod}) - Fresh credits assigned`,
        });

        // Normalize plan name to match database (capitalize first letter)
        if (planName) {
          user.subscriptionPlan =
            planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase();
        }

        // Record promo code usage if promo was applied
        if (promoCodeStr) {
          try {
            const promo = await PromoCode.findOne({ code: promoCodeStr.trim().toUpperCase() });
            if (promo) {
              promo.usedCount += 1;
              promo.usedBy.push({
                userId: user._id,
                email: user.email,
                planName: planName,
                discountApplied: promoDiscountAmount || 0,
                originalAmount: originalAmount || amount || 0,
                finalAmount: amount || 0,
                usedAt: new Date(),
              });
              await promo.save();
              logger.info("Promo code usage recorded:", {
                code: promo.code,
                userEmail: user.email,
                discount: promoDiscountAmount,
              });
            }
          } catch (promoErr) {
            logger.error("Failed to record promo usage (non-fatal):", promoErr);
          }
        }

        await user.save();
        logger.info("User credits updated:", {
          email: user.email,
          plan: user.subscriptionPlan,
          totalCredits: user.totalCredits,
          usedPhotoshootCredits: user.usedPhotoshootCredits,
          usedMarketingCredits: user.usedMarketingCredits,
        });
      } else {
        // If plan not found, still update subscription but don't change credits
        user.subscriptionPlan = planName;
        user.subscriptionBillingPeriod = billingPeriod;
        const purchaseDate = new Date();
        user.subscriptionPurchasedAt = purchaseDate;
        const expirationDate = new Date();
        if (billingPeriod === "monthly") {
          // Add 1 month to current date
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        } else if (billingPeriod === "yearly") {
          // Add exactly 1 year (365 days) to current date
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        } else {
          // Default to monthly if billingPeriod is invalid
          logger.warn(
            `Invalid billingPeriod: ${billingPeriod}, defaulting to monthly`,
          );
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        }
        user.subscriptionExpiresAt = expirationDate;

        // Log expiry calculation for debugging
        logger.info("Subscription expiry set (plan not found):", {
          email: user.email,
          planName: planName,
          billingPeriod: billingPeriod,
          purchaseDate: purchaseDate.toISOString(),
          expiryDate: expirationDate.toISOString(),
          daysUntilExpiry: Math.round(
            (expirationDate - purchaseDate) / (1000 * 60 * 60 * 24),
          ),
        });

        await user.save();
      }

      // Fetch updated user to get latest credits
      const updatedUser = await User.findById(userId);

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        planName: planName,
        billingPeriod: billingPeriod,
        photoshootCredits: updatedUser?.photoshootCredits || 0,
        marketingPosterCredits: updatedUser?.marketingPosterCredits || 0,
        promoCode: promoCodeStr || null,
        promoDiscount: promoDiscountAmount || null,
        originalAmount: originalAmount || null,
      });
    } catch (error) {
      logger.error("Error verifying payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify payment",
        error: error.message,
      });
    }
  },
);

/**
 * @route   POST /api/payment/log-failed
 * @desc    Log a failed Razorpay payment attempt to the user's credit history
 * @access  Protected
 */
router.post("/log-failed", protect, async (req, res) => {
  try {
    const { planName, billingPeriod, orderId, errorCode, errorDescription, amount } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.creditHistory) user.creditHistory = [];
    user.creditHistory.push({
      date: new Date(),
      action: "payment_failed",
      planName: planName || "Unknown",
      reason: errorDescription || "Payment failed",
      billingPeriod: billingPeriod || null,
      orderId: orderId || null,
      errorCode: errorCode || null,
      amount: amount || null,
    });

    await user.save();
    res.status(200).json({ success: true, message: "Failed payment logged" });
  } catch (error) {
    logger.error("Error logging failed payment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/**
 * @route   GET /api/payment/purchase-history
 * @desc    Get user's purchase history (successful + failed payments)
 * @access  Protected
 */
router.get("/purchase-history", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "creditHistory name email subscriptionPurchasedAt subscriptionBillingPeriod"
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Load all plans to fill in missing amounts for old purchases
    const plans = await PricePlan.find({});
    const planPriceMap = {};
    plans.forEach((p) => {
      planPriceMap[p.name.toLowerCase()] = {
        monthly: parseFloat(p.price) || 0,
        yearly: parseFloat(p.yearlyPrice) || 0,
      };
    });

    // Filter only purchase & payment_failed events, sort newest first
    const history = (user.creditHistory || [])
      .filter((h) => h.action === "purchase" || h.action === "payment_failed")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((h, idx) => {
        // For old purchases without amount, derive from PricePlan
        let amount = h.amount || null;
        if (!amount && h.action === "purchase" && h.planName) {
          const planKey = h.planName.toLowerCase();
          const planPrices = planPriceMap[planKey];
          if (planPrices) {
            const billing = h.billingPeriod || "monthly";
            if (billing === "yearly") {
              amount = planPrices.yearly * 12; // yearly = monthlyPrice * 12
            } else {
              amount = planPrices.monthly;
            }
          }
        }

        return {
          index: idx,
          date: h.date,
          action: h.action,
          planName: h.planName,
          billingPeriod: h.billingPeriod || null,
          totalCredits: h.totalCredits ? h.totalCredits.new : null,
          reason: h.reason || null,
          errorCode: h.errorCode || null,
          orderId: h.orderId || h.razorpayOrderId || null,
          razorpayPaymentId: h.razorpayPaymentId || null,
          amount: amount,
          promoCode: h.promoCode || null,
          promoDiscount: h.promoDiscount || null,
          originalAmount: h.originalAmount || null,
        };
      });

    res.status(200).json({
      success: true,
      history,
      userName: user.name || null,
      userEmail: user.email || null,
    });
  } catch (error) {
    logger.error("Error fetching purchase history:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


/**
 * @route   GET /api/payment/invoice/:index
 * @desc    Get invoice data for a specific successful purchase
 * @access  Protected
 */
router.get("/invoice/:index", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "creditHistory name email"
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const purchases = (user.creditHistory || [])
      .filter((h) => h.action === "purchase")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const idx = parseInt(req.params.index);
    if (isNaN(idx) || idx < 0 || idx >= purchases.length) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const purchase = purchases[idx];
    res.status(200).json({
      success: true,
      invoice: {
        invoiceNumber: `MS-${new Date(purchase.date).getFullYear()}-${String(idx + 1).padStart(4, "0")}`,
        date: purchase.date,
        planName: purchase.planName,
        billingPeriod: purchase.billingPeriod || null,
        totalCredits: purchase.totalCredits ? purchase.totalCredits.new : null,
        amount: purchase.amount || null,
        reason: purchase.reason || null,
      },
      userName: user.name || null,
      userEmail: user.email || null,
    });
  } catch (error) {
    logger.error("Error fetching invoice:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;

