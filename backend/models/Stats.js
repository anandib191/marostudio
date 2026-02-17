import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    totalUsers: {
      type: Number,
      default: 0,
    },
    totalGenerations: {
      type: Number,
      default: 0,
    },
    activeSubscriptions: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;
