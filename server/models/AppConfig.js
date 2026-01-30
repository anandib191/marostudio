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
  creditsPerPhotoshootGeneration: {
    type: Number,
    default: 20,
    min: 1,
  },
  creditsPerMarketingGeneration: {
    type: Number,
    default: 5,
    min: 1,
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
      creditsPerPhotoshootGeneration: 20,
      creditsPerMarketingGeneration: 5,
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
  
  // Ensure credit generation fields exist (migrate old configs)
  if (config.creditsPerPhotoshootGeneration === undefined) {
    config.creditsPerPhotoshootGeneration = 20;
  }
  if (config.creditsPerMarketingGeneration === undefined) {
    config.creditsPerMarketingGeneration = 5;
  }
  
  return config;
};

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

export default AppConfig;
