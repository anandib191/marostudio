import express from 'express';
import PricePlan, { DEFAULT_PLANS } from '../models/PricePlan.js';

const router = express.Router();

/**
 * @route   GET /api/price-plans
 * @desc    Get price plans (public, used by PricingPage)
 */
router.get('/', async (req, res) => {
  try {
    // Set CORS headers explicitly
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const plans = await PricePlan.find().sort({ createdAt: 1 });
    // If no plans exist, return default plans
    if (plans.length === 0) {
      console.log('No plans in database, returning DEFAULT_PLANS');
      return res.status(200).json({ success: true, plans: DEFAULT_PLANS });
    }
    
    // Ensure plans have required fields
    const validPlans = plans.map(plan => ({
      name: plan.name || '',
      price: plan.price || '0',
      yearlyPrice: plan.yearlyPrice || '0',
      description: plan.description || '',
      features: Array.isArray(plan.features) ? plan.features : [],
      isPopular: plan.isPopular || false,
      photoshootCredits: plan.photoshootCredits || 0,
      marketingPosterCredits: plan.marketingPosterCredits || 0,
    }));
    
    console.log(`Returning ${validPlans.length} price plans`);
    res.status(200).json({ success: true, plans: validPlans });
  } catch (error) {
    console.error('Get price plans error:', error);
    // Return default plans on error as fallback
    res.status(200).json({ 
      success: true, 
      plans: DEFAULT_PLANS,
      error: 'Database error, using default plans'
    });
  }
});

// Handle OPTIONS request for CORS preflight
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

export default router;
