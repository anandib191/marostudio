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
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
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
