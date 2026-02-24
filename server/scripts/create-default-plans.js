import mongoose from 'mongoose';
import PricePlan, { DEFAULT_PLANS } from '../models/PricePlan.js';

async function createDefaultPlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maro-studio');
    console.log('Connected to database');
    
    await PricePlan.deleteMany({});
    console.log('Cleared existing plans');
    
    const createdPlans = await PricePlan.insertMany(DEFAULT_PLANS);
    console.log(`Created ${createdPlans.length} default plans:`);
    createdPlans.forEach(plan => {
      console.log(`- ${plan.name}: ${plan.totalCredits} credits`);
    });
    
    console.log('Default plans creation completed');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createDefaultPlans();
