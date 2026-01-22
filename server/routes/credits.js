import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/credits
 * @desc    Get user's photoshoot credits
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('photoshootCredits marketingPosterCredits subscriptionPlan subscriptionExpiresAt');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      photoshootCredits: user.photoshootCredits || 0,
      marketingPosterCredits: user.marketingPosterCredits || 0,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/credits/check
 * @desc    Check if user has enough credits for photoshoot generation
 * @access  Private
 */
router.post('/check', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'photoshoot' or 'marketing'
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const credits = type === 'marketing' 
      ? (user.marketingPosterCredits || 0)
      : (user.photoshootCredits || 0);
    
    if (credits <= 0) {
      const creditType = type === 'marketing' ? 'marketing poster' : 'photoshoot';
      return res.status(200).json({
        success: false,
        hasCredits: false,
        credits: credits,
        message: `You have no ${creditType} credits remaining. Please upgrade your plan.`,
      });
    }

    res.status(200).json({
      success: true,
      hasCredits: true,
      credits: credits,
    });
  } catch (error) {
    console.error('Check credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/credits/deduct
 * @desc    Deduct one credit after generation (photoshoot or marketing poster)
 * @access  Private
 */
router.post('/deduct', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'photoshoot' or 'marketing'
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (type === 'marketing') {
      const currentCredits = user.marketingPosterCredits || 0;
      if (currentCredits <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient marketing poster credits',
        });
      }
      user.marketingPosterCredits = Math.max(0, currentCredits - 1);
    } else {
      const currentCredits = user.photoshootCredits || 0;
      if (currentCredits <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient photoshoot credits',
        });
      }
      user.photoshootCredits = Math.max(0, currentCredits - 1);
    }
    
    await user.save();

    res.status(200).json({
      success: true,
      photoshootCredits: user.photoshootCredits,
      marketingPosterCredits: user.marketingPosterCredits,
      message: 'Credit deducted successfully',
    });
  } catch (error) {
    console.error('Deduct credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
