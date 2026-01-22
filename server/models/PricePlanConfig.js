import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  yearlyPrice: { type: String, required: true },
  description: { type: String, default: '' },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
}, { _id: false });

const pricePlanConfigSchema = new mongoose.Schema({
  plans: [planSchema],
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const DEFAULT_PLANS = [
  { name: 'Silver', price: '49', yearlyPrice: '40', description: 'For early brands and creators', features: ['Access to model library', 'Background presets', 'Max upload file size: 10 MB', 'Max output resolution: HD (up to 1080px)', 'No watermark', 'Regenerations per image: 1', 'Edits per image: 1', 'Email Support within 48 hours'], isPopular: false },
  { name: 'Gold', price: '59', yearlyPrice: '47', description: 'For growing teams', features: ['Access to model library', 'Background presets', 'Max upload file size: 10 MB', 'Max output resolution: 2K (up to 2048px)', 'No watermark', 'Regenerations per image: 2', 'Edits per image: 1', 'Email Support within 24 hours'], isPopular: true },
  { name: 'Platinum', price: '68', yearlyPrice: '54', description: 'For high-velocity teams', features: ['Access to model library', 'Background presets', 'Max upload file size: 10 MB', 'Max output resolution: 2K (up to 2048px)', 'No watermark', 'Regenerations per image: 3', 'Edits per image: 1', 'Email Support within 12 hours'], isPopular: false },
];

const PricePlanConfig = mongoose.model('PricePlanConfig', pricePlanConfigSchema);

export default PricePlanConfig;
