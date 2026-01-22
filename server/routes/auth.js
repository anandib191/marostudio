import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import AppConfig from '../models/AppConfig.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to user's email
 * @access  Public
 */
router.post(
  '/send-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('is_admin').optional().isBoolean(),
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

      const { email, is_admin } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email is in admin list
      const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
      const isAdmin = is_admin && adminEmails.includes(normalizedEmail);

      // Generate OTP
      const otp = generateOTP();

      // Delete any existing OTP for this email
      await OTP.deleteMany({ email: normalizedEmail });

      // Save new OTP
      const otpDoc = new OTP({
        email: normalizedEmail,
        otp,
        isAdmin,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      await otpDoc.save();

      // Send email
      try {
        await sendOTPEmail(normalizedEmail, otp);
        res.status(200).json({
          success: true,
          message: 'OTP sent successfully',
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Still delete OTP if email fails
        await OTP.deleteOne({ email: normalizedEmail });
        return res.status(500).json({
          success: false,
          message: 'Failed to send email. Please try again.',
        });
      }
    } catch (error) {
      logger.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and return JWT token
 * @access  Public
 */
router.post(
  '/verify-otp',
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

      // Determine user role
      const role = otpDoc.isAdmin ? 'admin' : 'user';

      // Find or create user
      let user = await User.findOne({ email: normalizedEmail });

      // Get free tier credits from config
      const config = await AppConfig.getConfig();
      const freePhotoshootCredits = config.freeTierPhotoshootCredits || 3;
      const freeMarketingCredits = config.freeTierMarketingPosterCredits || 5;

      if (!user) {
        user = new User({
          email: normalizedEmail,
          role,
          isVerified: true,
          photoshootCredits: freePhotoshootCredits,
          marketingPosterCredits: freeMarketingCredits,
        });
        await user.save();
      } else {
        // Update user role if changed to admin
        if (otpDoc.isAdmin && user.role !== 'admin') {
          user.role = 'admin';
        }
        user.isVerified = true;
        user.lastLogin = new Date();
        // Only set free credits if user has no subscription plan AND credits are undefined/null
        // Don't reset credits if user has a paid plan
        if (!user.subscriptionPlan) {
          if (user.photoshootCredits === undefined || user.photoshootCredits === null) {
            user.photoshootCredits = freePhotoshootCredits;
          }
          if (user.marketingPosterCredits === undefined || user.marketingPosterCredits === null) {
            user.marketingPosterCredits = freeMarketingCredits;
          }
        }
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30m' }
      );

      // Delete OTP after successful verification
      await OTP.deleteOne({ email: normalizedEmail });

      res.status(200).json({
        success: true,
        access_token: token,
        token_type: 'bearer',
        role: user.role,
        email: user.email,
      });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

export default router;
