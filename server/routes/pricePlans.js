import express from 'express';
import PricePlan, { DEFAULT_PLANS } from '../models/PricePlan.js';

const router = express.Router();

/**
 * @route   GET /api/price-plans
 * @desc    Get price plans (public, used by PricingPage)
 */
router.get('/', async (req, res) => {
  try {
    const plans = await PricePlan.find().sort({ createdAt: 1 });
    // If no plans exist, return default plans
    if (plans.length === 0) {
      return res.status(200).json({ success: true, plans: DEFAULT_PLANS });
    }
    res.status(200).json({ success: true, plans });
  } catch (error) {
    console.error('Get price plans error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
