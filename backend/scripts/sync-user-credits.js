import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import PricePlan from '../models/PricePlan.js';
import AppConfig from '../models/AppConfig.js';

dotenv.config({ path: './.env' });

const syncUserCredits = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all plans
    const plans = await PricePlan.find({});
    console.log(`Found ${plans.length} plans in database`);

    // Create a map of plan names (case-insensitive) to credits
    const planCreditsMap = {};
    plans.forEach(plan => {
      // Store both lowercase and original case
      planCreditsMap[plan.name.toLowerCase()] = {
        photoshootCredits: plan.photoshootCredits || 0,
        marketingPosterCredits: plan.marketingPosterCredits || 0,
      };
      planCreditsMap[plan.name] = {
        photoshootCredits: plan.photoshootCredits || 0,
        marketingPosterCredits: plan.marketingPosterCredits || 0,
      };
    });

    console.log('Plan credits map:', planCreditsMap);

    // Get all users with subscription plans
    const users = await User.find({
      subscriptionPlan: { $ne: null, $exists: true },
      subscriptionExpiresAt: { $gt: new Date() } // Only active subscriptions
    });

    console.log(`Found ${users.length} users with active subscriptions`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        const planName = user.subscriptionPlan;
        const planKey = planName?.toLowerCase();
        
        if (!planCreditsMap[planKey] && !planCreditsMap[planName]) {
          console.log(`⚠️  Plan "${planName}" not found for user ${user.email}`);
          skipped++;
          continue;
        }

        const credits = planCreditsMap[planKey] || planCreditsMap[planName];
        
        // Check if credits need updating
        const needsUpdate = 
          user.photoshootCredits !== credits.photoshootCredits ||
          user.marketingPosterCredits !== credits.marketingPosterCredits;

        if (needsUpdate) {
          user.photoshootCredits = credits.photoshootCredits;
          user.marketingPosterCredits = credits.marketingPosterCredits;
          await user.save();
          
          console.log(`✅ Updated ${user.email} (${planName}):`, {
            photoshootCredits: credits.photoshootCredits,
            marketingPosterCredits: credits.marketingPosterCredits
          });
          updated++;
        } else {
          console.log(`⏭️  Skipped ${user.email} (${planName}): credits already correct`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error updating user ${user.email}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log(`Total processed: ${users.length}`);

    // Also update users with expired subscriptions to free tier
    const config = await AppConfig.getConfig();
    const freePhotoshootCredits = config.freeTierPhotoshootCredits || 3;
    const freeMarketingCredits = config.freeTierMarketingPosterCredits || 5;

    const expiredUsers = await User.find({
      subscriptionPlan: { $ne: null, $exists: true },
      subscriptionExpiresAt: { $lte: new Date() }
    });

    if (expiredUsers.length > 0) {
      console.log(`\nFound ${expiredUsers.length} users with expired subscriptions`);
      for (const user of expiredUsers) {
        user.subscriptionPlan = null;
        user.subscriptionExpiresAt = null;
        user.photoshootCredits = freePhotoshootCredits;
        user.marketingPosterCredits = freeMarketingCredits;
        await user.save();
        console.log(`🔄 Reset ${user.email} to free tier (expired subscription)`);
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Sync completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

syncUserCredits();
