import mongoose from 'mongoose';

const appConfigSchema = new mongoose.Schema({
  freeTierPhotoshootCredits: {
    type: Number,
    default: 3,
    min: 0,
  },
  freeTierMarketingPosterCredits: {
    type: Number,
    default: 5,
    min: 0,
  },
  statistics: {
    categories: {
      type: String,
      default: '4+',
    },
    activeUsers: {
      type: String,
      default: '10k+',
    },
    imageGenerated: {
      type: String,
      default: '50k+',
    },
    activeSubscription: {
      type: String,
      default: '1k+',
    },
  },
}, {
  timestamps: true,
});

// Ensure only one config document exists
appConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = new this({
      freeTierPhotoshootCredits: 3,
      freeTierMarketingPosterCredits: 5,
      statistics: {
        categories: '4+',
        activeUsers: '10k+',
        imageGenerated: '50k+',
        activeSubscription: '1k+',
      },
    });
    await config.save();
  } else if (!config.statistics) {
    // Migrate existing configs to include statistics
    config.statistics = {
      categories: '4+',
      activeUsers: '10k+',
      imageGenerated: '50k+',
      activeSubscription: '1k+',
    };
    await config.save();
  }
  return config;
};

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

export default AppConfig;
