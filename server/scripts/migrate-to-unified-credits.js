import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Migration script to convert existing users to unified credit system
 * This script should be run once to migrate all existing users
 */

async function migrateToUnifiedCredits() {
  try {
    console.log('Starting migration to unified credit system...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maro-studio');
    console.log('Connected to database');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      try {
        // Skip if already migrated (has totalCredits field)
        if (user.totalCredits !== undefined) {
          skippedCount++;
          continue;
        }
        
        // Calculate total credits from existing individual credits
        const photoshootCredits = user.photoshootCredits || 3; // Default free tier
        const marketingCredits = user.marketingPosterCredits || 5; // Default free tier
        const totalCredits = photoshootCredits + marketingCredits;
        
        // Calculate used credits (if any)
        const usedPhotoshootCredits = Math.max(0, photoshootCredits - (user.photoshootCredits || 0));
        const usedMarketingCredits = Math.max(0, marketingCredits - (user.marketingPosterCredits || 0));
        
        // Update user with unified credit system
        await User.findByIdAndUpdate(user._id, {
          totalCredits: totalCredits,
          usedPhotoshootCredits: usedPhotoshootCredits,
          usedMarketingCredits: usedMarketingCredits,
          // Add to credit history
          $push: {
            creditHistory: {
              date: new Date(),
              action: 'admin_sync',
              planName: user.subscriptionPlan || 'Free Tier',
              totalCredits: {
                previous: 0,
                new: totalCredits,
                change: totalCredits,
              },
              usedPhotoshootCredits: {
                previous: 0,
                new: usedPhotoshootCredits,
                change: usedPhotoshootCredits,
              },
              usedMarketingCredits: {
                previous: 0,
                new: usedMarketingCredits,
                change: usedMarketingCredits,
              },
              reason: 'Migration to unified credit system',
              adminEmail: 'system@marostudio.com'
            }
          }
        });
        
        migratedCount++;
        console.log(`Migrated user: ${user.email} - Total: ${totalCredits}, Used Photoshoot: ${usedPhotoshootCredits}, Used Marketing: ${usedMarketingCredits}`);
        
      } catch (error) {
        console.error(`Error migrating user ${user.email}:`, error);
      }
    }
    
    console.log(`\nMigration completed:`);
    console.log(`- Total users found: ${users.length}`);
    console.log(`- Users migrated: ${migratedCount}`);
    console.log(`- Users skipped (already migrated): ${skippedCount}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToUnifiedCredits();
}

export default migrateToUnifiedCredits;
