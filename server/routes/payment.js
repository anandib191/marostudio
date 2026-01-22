import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import PricePlan from '../models/PricePlan.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Initialize Razorpay lazily (only when needed)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * @route   POST /api/payment/create-order
 * @desc    Create a Razorpay order
 * @access  Protected (requires authentication)
 */
router.post(
  '/create-order',
  protect,
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('planName').notEmpty().withMessage('Plan name is required'),
    body('billingPeriod').isIn(['monthly', 'yearly']).withMessage('Billing period must be monthly or yearly'),
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

      const { amount, planName, billingPeriod } = req.body;
      const userId = req.user._id.toString();

      // Convert amount to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = Math.round(parseFloat(amount) * 100);

      // Get Razorpay instance
      const razorpay = getRazorpayInstance();

      // Create order options
      // Receipt must be max 40 characters, so we use a shorter format
      const timestamp = Date.now().toString().slice(-10); // Last 10 digits of timestamp
      const userIdShort = userId.slice(-8); // Last 8 characters of userId
      const receipt = `NGP_${timestamp}_${userIdShort}`; // Max length: 3 + 1 + 10 + 1 + 8 = 23 chars
      
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt,
        notes: {
          userId: userId,
          planName: planName,
          billingPeriod: billingPeriod,
          userEmail: req.user.email,
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
      logger.error('Error creating Razorpay order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/payment/verify-payment
 * @desc    Verify Razorpay payment signature
 * @access  Protected (requires authentication)
 */
router.post(
  '/verify-payment',
  protect,
  [
    body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Signature is required'),
    body('planName').notEmpty().withMessage('Plan name is required'),
    body('billingPeriod').isIn(['monthly', 'yearly']).withMessage('Billing period must be monthly or yearly'),
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

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName, billingPeriod } = req.body;
      const userId = req.user._id.toString();

      // Create signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      // Verify signature
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid signature',
        });
      }

      // Payment verified successfully
      // Update user subscription
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Get plan details to update credits (case-insensitive search)
      const plan = await PricePlan.findOne({ 
        $or: [
          { name: planName },
          { name: new RegExp(`^${planName}$`, 'i') }
        ]
      });
      console.log('Found plan:', plan ? plan.name : 'NOT FOUND', 'Credits:', plan ? { photoshoot: plan.photoshootCredits, marketing: plan.marketingPosterCredits } : 'N/A');
      if (plan) {
        // Update subscription plan
        user.subscriptionPlan = planName;
        
        // Calculate expiration date based on billing period
        const expirationDate = new Date();
        if (billingPeriod === 'monthly') {
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        } else {
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        }
        user.subscriptionExpiresAt = expirationDate;

        // Set credits to plan amount (not add, replace with plan credits)
        user.photoshootCredits = plan.photoshootCredits || 0;
        user.marketingPosterCredits = plan.marketingPosterCredits || 0;
        
        // Normalize plan name to match database (capitalize first letter)
        if (planName) {
          user.subscriptionPlan = planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase();
        }

        await user.save();
        logger.info('User credits updated:', {
          email: user.email,
          plan: user.subscriptionPlan,
          photoshootCredits: user.photoshootCredits,
          marketingPosterCredits: user.marketingPosterCredits
        });
      } else {
        // If plan not found, still update subscription but don't change credits
        user.subscriptionPlan = planName;
        const expirationDate = new Date();
        if (billingPeriod === 'monthly') {
          expirationDate.setMonth(expirationDate.getMonth() + 1);
        } else {
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        }
        user.subscriptionExpiresAt = expirationDate;
        await user.save();
      }

      // Fetch updated user to get latest credits
      const updatedUser = await User.findById(userId);
      
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        planName: planName,
        billingPeriod: billingPeriod,
        photoshootCredits: updatedUser?.photoshootCredits || 0,
        marketingPosterCredits: updatedUser?.marketingPosterCredits || 0,
      });
    } catch (error) {
      logger.error('Error verifying payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: error.message,
      });
    }
  }
);

export default router;
