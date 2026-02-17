#!/usr/bin/env node
/**
 * Migration script to convert price plans from array-based structure to individual documents
 * 
 * Old structure: One document with plans array
 * New structure: Each plan is a separate document
 * 
 * Run from server folder: node scripts/migrate-price-plans.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/db.js';
import PricePlanConfig from '../models/PricePlanConfig.js';
import PricePlan from '../models/PricePlan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set. Create a .env file in the server folder with MONGODB_URI.');
    process.exit(1);
  }

  await connectDB();
  console.log('Connected to database...\n');

  try {
    // Check if new structure already has plans
    const existingPlans = await PricePlan.countDocuments();
    if (existingPlans > 0) {
      console.log(`⚠️  Found ${existingPlans} plans in new structure.`);
      console.log('Migration may have already been run. Do you want to continue?');
      console.log('(This will create duplicate plans if old structure still exists)');
      // For automated migration, we'll continue
    }

    // Get old structure data
    const oldConfig = await PricePlanConfig.findOne().sort({ updatedAt: -1 });
    
    if (!oldConfig || !oldConfig.plans || oldConfig.plans.length === 0) {
      console.log('✓ No old structure data found. Migration not needed.');
      process.exit(0);
    }

    console.log(`Found ${oldConfig.plans.length} plans in old structure.\n`);

    // Convert and insert plans
    const plansToInsert = oldConfig.plans.map((plan) => ({
      name: plan.name,
      price: plan.price,
      yearlyPrice: plan.yearlyPrice,
      description: plan.description || '',
      features: plan.features || [],
      isPopular: plan.isPopular || false,
    }));

    // Ensure only one plan is popular
    let foundPopular = false;
    const finalPlans = plansToInsert.map((plan) => {
      if (plan.isPopular) {
        if (foundPopular) {
          return { ...plan, isPopular: false };
        } else {
          foundPopular = true;
          return plan;
        }
      }
      return plan;
    });

    // Insert plans into new structure
    const insertedPlans = await PricePlan.insertMany(finalPlans);
    console.log(`✓ Successfully migrated ${insertedPlans.length} plans to new structure.\n`);

    console.log('Migration completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Test the new structure by accessing /api/price-plans');
    console.log('2. Once confirmed working, you can delete the old PricePlanConfig collection if desired');
    console.log('   (Old collection: priceplanconfigs)');

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
