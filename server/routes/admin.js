import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import Stats from '../models/Stats.js';
import PricePlanConfig, { DEFAULT_PLANS } from '../models/PricePlanConfig.js';
import PricePlan from '../models/PricePlan.js';
import OTP from '../models/OTP.js';
import AppConfig from '../models/AppConfig.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, admin, async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Get active subscriptions (users with verified accounts)
    const activeSubscriptions = await User.countDocuments({ isVerified: true });

    // Get or create stats document
    let stats = await Stats.findOne();
    if (!stats) {
      stats = new Stats({
        totalUsers,
        totalGenerations: 0,
        activeSubscriptions,
        revenue: 0,
      });
      await stats.save();
    } else {
      // Update stats
      stats.totalUsers = totalUsers;
      stats.activeSubscriptions = activeSubscriptions;
      stats.lastUpdated = new Date();
      await stats.save();
    }

    res.status(200).json({
      success: true,
      totalUsers: stats.totalUsers,
      totalGenerations: stats.totalGenerations,
      activeSubscriptions: stats.activeSubscriptions,
      revenue: stats.revenue,
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (paginated, optionally filtered by role)
 * @access  Private/Admin
 */
router.get('/users', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role; // 'user' or 'admin' or undefined for all

    const query = role ? { role } : {};
    const users = await User.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    // Get all plans to calculate used credits
    const plans = await PricePlan.find({});
    const planMap = {};
    plans.forEach(plan => {
      planMap[plan.name.toLowerCase()] = plan;
      planMap[plan.name] = plan;
    });

    // Get free tier config
    const config = await AppConfig.getConfig();
    const freePhotoshootCredits = config.freeTierPhotoshootCredits || 3;
    const freeMarketingCredits = config.freeTierMarketingPosterCredits || 5;

    // Enrich users with plan info, used credits, and active status
    const enrichedUsers = users.map(user => {
      const planName = user.subscriptionPlan;
      const plan = planName ? (planMap[planName.toLowerCase()] || planMap[planName]) : null;
      
      // Calculate total credits based on plan or free tier
      const totalPhotoshootCredits = plan ? (plan.photoshootCredits || 0) : freePhotoshootCredits;
      const totalMarketingCredits = plan ? (plan.marketingPosterCredits || 0) : freeMarketingCredits;
      
      // Calculate used credits
      const usedPhotoshootCredits = Math.max(0, totalPhotoshootCredits - (user.photoshootCredits || 0));
      const usedMarketingCredits = Math.max(0, totalMarketingCredits - (user.marketingPosterCredits || 0));
      
      // Check if subscription is active
      const isActive = user.subscriptionPlan && user.subscriptionExpiresAt 
        ? new Date(user.subscriptionExpiresAt) > new Date()
        : false;

      return {
        ...user.toObject(),
        planName: planName || 'Free',
        totalPhotoshootCredits,
        totalMarketingCredits,
        usedPhotoshootCredits,
        usedMarketingCredits,
        isActive,
      };
    });

    res.status(200).json({
      success: true,
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete a user (admin only)
 * @access  Private/Admin
 */
router.delete('/users/:userId', protect, admin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting admin users (they should use remove-admin endpoint)
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users. Use remove-admin endpoint instead.',
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

/**
 * @route   GET /api/admin/price-plans
 * @desc    Get price plans (admin)
 */
router.get('/price-plans', protect, admin, async (req, res) => {
  try {
    const plans = await PricePlan.find().sort({ createdAt: 1 });
    // If no plans exist, return default plans
    if (plans.length === 0) {
      return res.status(200).json({ success: true, plans: DEFAULT_PLANS });
    }
    res.status(200).json({ success: true, plans });
  } catch (error) {
    logger.error('Get price plans error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/price-plans
 * @desc    Update all price plans (admin) - replaces all plans
 */
router.put('/price-plans', protect, admin, async (req, res) => {
  try {
    const { plans } = req.body;
    if (!Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({ success: false, message: 'plans must be a non-empty array' });
    }
    // Validate each plan
    for (const p of plans) {
      if (!p.name || p.price == null || p.yearlyPrice == null) {
        return res.status(400).json({ success: false, message: 'Each plan must have name, price, yearlyPrice' });
      }
    }

    // Delete all existing plans
    await PricePlan.deleteMany({});

    // Insert new plans
    const plansToInsert = plans.map((p) => ({
      name: String(p.name),
      price: String(p.price),
      yearlyPrice: String(p.yearlyPrice),
      description: String(p.description || ''),
      features: Array.isArray(p.features) ? p.features.map(String) : [],
      isPopular: Boolean(p.isPopular),
      photoshootCredits: Number(p.photoshootCredits) || 0,
      marketingPosterCredits: Number(p.marketingPosterCredits) || 0,
    }));

    // Ensure only one plan is popular
    let foundPopular = false;
    const finalPlans = plansToInsert.map((plan) => {
      if (plan.isPopular) {
        if (foundPopular) {
          return { ...plan, isPopular: false };
        } else {
          foundPopular = true;
          return plan;
        }
      }
      return plan;
    });

    const insertedPlans = await PricePlan.insertMany(finalPlans);
    res.status(200).json({ success: true, plans: insertedPlans });
  } catch (error) {
    logger.error('Update price plans error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/price-plans
 * @desc    Create a new price plan (admin)
 */
router.post('/price-plans', protect, admin, async (req, res) => {
  try {
    const { name, price, yearlyPrice, description, features, isPopular, photoshootCredits, marketingPosterCredits } = req.body;
    
    if (!name || price == null || yearlyPrice == null) {
      return res.status(400).json({ success: false, message: 'name, price, and yearlyPrice are required' });
    }

    // If setting as popular, unset all others
    if (isPopular) {
      await PricePlan.updateMany({}, { $set: { isPopular: false } });
    }

    const newPlan = new PricePlan({
      name: String(name),
      price: String(price),
      yearlyPrice: String(yearlyPrice),
      description: String(description || ''),
      features: Array.isArray(features) ? features.map(String).filter(f => f.trim().length > 0) : [],
      isPopular: Boolean(isPopular),
      photoshootCredits: Number(photoshootCredits) || 0,
    });

    await newPlan.save();
    res.status(201).json({ success: true, plan: newPlan });
  } catch (error) {
    console.error('Create price plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/price-plans/:id
 * @desc    Update a single price plan (admin)
 */
router.put('/price-plans/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, yearlyPrice, description, features, isPopular, photoshootCredits, marketingPosterCredits } = req.body;

    if (!name || price == null || yearlyPrice == null) {
      return res.status(400).json({ success: false, message: 'name, price, and yearlyPrice are required' });
    }

    // If setting as popular, unset all others
    if (isPopular) {
      await PricePlan.updateMany({ _id: { $ne: id } }, { $set: { isPopular: false } });
    }

    const updatedPlan = await PricePlan.findByIdAndUpdate(
      id,
      {
        name: String(name),
        price: String(price),
        yearlyPrice: String(yearlyPrice),
        description: String(description || ''),
        features: Array.isArray(features) ? features.map(String).filter(f => f.trim().length > 0) : [],
        isPopular: Boolean(isPopular),
        photoshootCredits: Number(photoshootCredits) || 0,
        marketingPosterCredits: Number(marketingPosterCredits) || 0,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, plan: updatedPlan });
  } catch (error) {
    logger.error('Update price plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/price-plans/:id
 * @desc    Delete a price plan (admin)
 */
router.delete('/price-plans/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await PricePlan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete price plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/sync-credits
 * @desc    Sync user credits based on their subscription plans (admin only)
 * @access  Private/Admin
 */
router.post('/sync-credits', protect, admin, async (req, res) => {
  try {
    // Get all plans
    const plans = await PricePlan.find({});
    
    // Create a map of plan names (case-insensitive) to credits
    const planCreditsMap = {};
    plans.forEach(plan => {
      planCreditsMap[plan.name.toLowerCase()] = {
        photoshootCredits: plan.photoshootCredits || 0,
        marketingPosterCredits: plan.marketingPosterCredits || 0,
      };
      planCreditsMap[plan.name] = {
        photoshootCredits: plan.photoshootCredits || 0,
        marketingPosterCredits: plan.marketingPosterCredits || 0,
      };
    });

    // Get all users with subscription plans
    const users = await User.find({
      subscriptionPlan: { $ne: null, $exists: true },
      subscriptionExpiresAt: { $gt: new Date() } // Only active subscriptions
    });

    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const user of users) {
      try {
        const planName = user.subscriptionPlan;
        const planKey = planName?.toLowerCase();
        
        if (!planCreditsMap[planKey] && !planCreditsMap[planName]) {
          errors.push(`Plan "${planName}" not found for user ${user.email}`);
          skipped++;
          continue;
        }

        const credits = planCreditsMap[planKey] || planCreditsMap[planName];
        
        // Check if credits need updating
        const needsUpdate = 
          user.photoshootCredits !== credits.photoshootCredits ||
          user.marketingPosterCredits !== credits.marketingPosterCredits;

        if (needsUpdate) {
          user.photoshootCredits = credits.photoshootCredits;
          user.marketingPosterCredits = credits.marketingPosterCredits;
          await user.save();
          updated++;
        } else {
          skipped++;
        }
      } catch (error) {
        errors.push(`Error updating user ${user.email}: ${error.message}`);
      }
    }

    // Also reset expired subscriptions to free tier
    const config = await AppConfig.getConfig();
    const freePhotoshootCredits = config.freeTierPhotoshootCredits || 3;
    const freeMarketingCredits = config.freeTierMarketingPosterCredits || 5;

    const expiredUsers = await User.find({
      subscriptionPlan: { $ne: null, $exists: true },
      subscriptionExpiresAt: { $lte: new Date() }
    });

    let expiredReset = 0;
    for (const user of expiredUsers) {
      user.subscriptionPlan = null;
      user.subscriptionExpiresAt = null;
      user.photoshootCredits = freePhotoshootCredits;
      user.marketingPosterCredits = freeMarketingCredits;
      await user.save();
      expiredReset++;
    }

    res.status(200).json({
      success: true,
      message: 'Credits synced successfully',
      stats: {
        updated,
        skipped,
        expiredReset,
        errors: errors.length,
        totalProcessed: users.length
      },
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    logger.error('Sync credits error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/admin/free-tier-credits
 * @desc    Get free tier credits configuration (admin only)
 * @access  Private/Admin
 */
router.get('/free-tier-credits', protect, admin, async (req, res) => {
  try {
    const config = await AppConfig.getConfig();
    res.status(200).json({
      success: true,
      freeTierPhotoshootCredits: config.freeTierPhotoshootCredits,
      freeTierMarketingPosterCredits: config.freeTierMarketingPosterCredits,
    });
  } catch (error) {
    console.error('Get free tier credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/free-tier-credits
 * @desc    Update free tier credits configuration (admin only)
 * @access  Private/Admin
 */
router.put('/free-tier-credits', protect, admin, [
  body('freeTierPhotoshootCredits').optional().isInt({ min: 0 }).withMessage('Photoshoot credits must be a non-negative integer'),
  body('freeTierMarketingPosterCredits').optional().isInt({ min: 0 }).withMessage('Marketing poster credits must be a non-negative integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { freeTierPhotoshootCredits, freeTierMarketingPosterCredits } = req.body;
    const config = await AppConfig.getConfig();

    if (freeTierPhotoshootCredits !== undefined) {
      config.freeTierPhotoshootCredits = parseInt(freeTierPhotoshootCredits);
    }
    if (freeTierMarketingPosterCredits !== undefined) {
      config.freeTierMarketingPosterCredits = parseInt(freeTierMarketingPosterCredits);
    }

    await config.save();

    res.status(200).json({
      success: true,
      message: 'Free tier credits updated successfully',
      freeTierPhotoshootCredits: config.freeTierPhotoshootCredits,
      freeTierMarketingPosterCredits: config.freeTierMarketingPosterCredits,
    });
  } catch (error) {
    logger.error('Update free tier credits error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/send-admin-otp
 * @desc    Send OTP to email for adding new admin (admin only)
 * @access  Private/Admin
 */
router.post(
  '/send-admin-otp',
  protect,
  admin,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
      }

      const { email } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Generate OTP
      const otp = generateOTP();

      // Delete any existing OTP for this email
      await OTP.deleteMany({ email: normalizedEmail });

      // Save new OTP with isAdmin=true (for admin creation)
      const otpDoc = new OTP({
        email: normalizedEmail,
        otp,
        isAdmin: true, // Always true for admin creation
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      await otpDoc.save();

      // Send email
      try {
        await sendOTPEmail(normalizedEmail, otp);
        res.status(200).json({
          success: true,
          message: 'OTP sent successfully to email',
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(500).json({
          success: false,
          message: 'Failed to send email. Please try again.',
        });
      }
    } catch (error) {
      logger.error('Send admin OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

/**
 * @route   POST /api/admin/verify-admin-otp
 * @desc    Verify OTP and create/update user as admin (admin only)
 * @access  Private/Admin
 */
router.post(
  '/verify-admin-otp',
  protect,
  admin,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array(),
        });
      }

      const { email, otp } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Find OTP
      const otpDoc = await OTP.findOne({ email: normalizedEmail });

      if (!otpDoc) {
        return res.status(400).json({
          success: false,
          message: 'OTP not found. Please request a new OTP.',
        });
      }

      // Check if OTP expired
      if (new Date() > otpDoc.expiresAt) {
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(400).json({
          success: false,
          message: 'OTP expired. Please request a new OTP.',
        });
      }

      // Verify OTP
      if (otpDoc.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP.',
        });
      }

      // Find or create user and set as admin
      let user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        user = new User({
          email: normalizedEmail,
          role: 'admin',
          isVerified: true,
        });
        await user.save();
      } else {
        // Update user to admin
        user.role = 'admin';
        user.isVerified = true;
        await user.save();
      }

      // Delete OTP after successful verification
      await OTP.deleteOne({ email: normalizedEmail });

      res.status(200).json({
        success: true,
        message: 'Admin created/updated successfully',
        user: {
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error('Verify admin OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

/**
 * @route   DELETE /api/admin/remove-admin/:userId
 * @desc    Remove admin role from user (convert to regular user)
 * @access  Private/Admin
 */
router.delete('/remove-admin/:userId', protect, admin, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserEmail = req.user.email.toLowerCase();

    // Find the user to remove admin from
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent self-removal
    if (user.email.toLowerCase() === currentUserEmail) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own admin privileges',
      });
    }

    // Only remove if they are currently an admin
    if (user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is not an admin',
      });
    }

    // Convert to regular user
    user.role = 'user';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Admin privileges removed successfully',
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Remove admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;
