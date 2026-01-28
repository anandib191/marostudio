import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    googleId: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    photoshootCredits: {
      type: Number,
      default: 3, // Free users get 3 credits
      min: 0,
    },
    marketingPosterCredits: {
      type: Number,
      default: 5, // Free users get 5 credits
      min: 0,
    },
    subscriptionPlan: {
      type: String,
      default: null, // null means free user
    },
    subscriptionBillingPeriod: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: null, // 'monthly' or 'yearly' - null means free user
    },
    subscriptionPurchasedAt: {
      type: Date,
      default: null, // Date when user purchased the subscription
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    // Store original plan credits when user purchases (for accurate used credits calculation)
    originalPlanPhotoshootCredits: {
      type: Number,
      default: null,
    },
    originalPlanMarketingPosterCredits: {
      type: Number,
      default: null,
    },
    // Credit change history for transparency
    creditHistory: [{
      date: {
        type: Date,
        default: Date.now,
      },
      action: {
        type: String,
        enum: ['purchase', 'admin_sync', 'usage', 'expiry', 'manual_adjustment'],
      },
      planName: String,
      photoshootCredits: {
        previous: Number,
        new: Number,
        change: Number, // positive = increase, negative = decrease
      },
      marketingPosterCredits: {
        previous: Number,
        new: Number,
        change: Number,
      },
      reason: String, // e.g., "Plan credits updated by admin", "Subscription expired"
      adminEmail: String, // If changed by admin
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Note: email index is automatically created by unique: true

const User = mongoose.model('User', userSchema);

export default User;
