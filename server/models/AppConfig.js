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
    });
    await config.save();
  }
  return config;
};

const AppConfig = mongoose.model('AppConfig', appConfigSchema);

export default AppConfig;
