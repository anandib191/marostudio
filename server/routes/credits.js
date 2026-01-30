import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import AppConfig from '../models/AppConfig.js';

const router = express.Router();

/**
 * @route   GET /api/credits
 * @desc    Get user's photoshoot credits
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    // Always fetch fresh data from database (no caching)
    const user = await User.findById(req.user._id).select('name photoshootCredits marketingPosterCredits subscriptionPlan subscriptionExpiresAt originalPlanPhotoshootCredits originalPlanMarketingPosterCredits');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Set cache-control headers to prevent client-side caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Calculate used credits for transparency
    const totalPhotoshootCredits = user.originalPlanPhotoshootCredits || user.photoshootCredits || 0;
    const totalMarketingCredits = user.originalPlanMarketingPosterCredits || user.marketingPosterCredits || 0;
    const usedPhotoshootCredits = Math.max(0, totalPhotoshootCredits - (user.photoshootCredits || 0));
    const usedMarketingCredits = Math.max(0, totalMarketingCredits - (user.marketingPosterCredits || 0));
    
    res.status(200).json({
      success: true,
      photoshootCredits: user.photoshootCredits || 0,
      marketingPosterCredits: user.marketingPosterCredits || 0,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      userName: user.name || null,
      // Credit transparency data
      totalPhotoshootCredits,
      totalMarketingCredits,
      usedPhotoshootCredits,
      usedMarketingCredits,
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/credits/history
 * @desc    Get user's credit change history
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('creditHistory');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      history: user.creditHistory || [],
    });
  } catch (error) {
    console.error('Get credit history error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/credits/check
 * @desc    Check if user has enough credits for photoshoot generation
 * @access  Private
 * @note    Each generation requires 20 credits
 */
router.post('/check', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'photoshoot' or 'marketing'
    
    // Get configurable credits per generation
    const config = await AppConfig.getConfig();
    const CREDITS_PER_GENERATION = type === 'marketing' 
      ? config.creditsPerMarketingGeneration 
      : config.creditsPerPhotoshootGeneration;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const credits = type === 'marketing' 
      ? (user.marketingPosterCredits || 0)
      : (user.photoshootCredits || 0);
    
    if (credits < CREDITS_PER_GENERATION) {
      const creditType = type === 'marketing' ? 'marketing poster' : 'photoshoot';
      return res.status(200).json({
        success: false,
        hasCredits: false,
        credits: credits,
        requiredCredits: CREDITS_PER_GENERATION,
        message: `You need ${CREDITS_PER_GENERATION} ${creditType} credits per generation. You have ${credits} credits remaining. Please upgrade your plan.`,
      });
    }

    res.status(200).json({
      success: true,
      hasCredits: true,
      credits: credits,
      requiredCredits: CREDITS_PER_GENERATION,
    });
  } catch (error) {
    console.error('Check credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/credits/deduct
 * @desc    Deduct credits after generation (photoshoot or marketing poster)
 * @access  Private
 * @note    Each generation costs configurable credits (default: 20 photoshoot, 5 marketing)
 */
router.post('/deduct', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'photoshoot' or 'marketing'
    
    // Get configurable credits per generation
    const config = await AppConfig.getConfig();
    const CREDITS_PER_GENERATION = type === 'marketing' 
      ? config.creditsPerMarketingGeneration 
      : config.creditsPerPhotoshootGeneration;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (type === 'marketing') {
      const currentCredits = user.marketingPosterCredits || 0;
      if (currentCredits < CREDITS_PER_GENERATION) {
        return res.status(400).json({
          success: false,
          message: `Insufficient marketing poster credits. You need ${CREDITS_PER_GENERATION} credits per generation.`,
        });
      }
      user.marketingPosterCredits = Math.max(0, currentCredits - CREDITS_PER_GENERATION);
    } else {
      const currentCredits = user.photoshootCredits || 0;
      if (currentCredits < CREDITS_PER_GENERATION) {
        return res.status(400).json({
          success: false,
          message: `Insufficient photoshoot credits. You need ${CREDITS_PER_GENERATION} credits per generation.`,
        });
      }
      user.photoshootCredits = Math.max(0, currentCredits - CREDITS_PER_GENERATION);
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      photoshootCredits: user.photoshootCredits,
      marketingPosterCredits: user.marketingPosterCredits,
      message: `${CREDITS_PER_GENERATION} credits deducted successfully`,
    });
  } catch (error) {
    console.error('Deduct credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
