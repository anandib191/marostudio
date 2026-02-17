import mongoose from "mongoose";
import PricePlan from "../models/PricePlan.js";

async function updatePlans() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/maro-studio",
    );
    console.log("Connected to database");

    const plans = await PricePlan.find({});
    console.log(`Found ${plans.length} plans`);

    for (const plan of plans) {
      if (!plan.totalCredits) {
        // Calculate totalCredits from existing credits if not set
        const totalCredits =
          (plan.photoshootCredits || 0) + (plan.marketingPosterCredits || 0);

        // Set default values based on plan name if no existing credits
        let newTotalCredits = totalCredits;
        if (totalCredits === 0) {
          switch (plan.name?.toLowerCase()) {
            case "silver":
              newTotalCredits = 1000;
              break;
            case "gold":
              newTotalCredits = 2500;
              break;
            case "platinum":
              newTotalCredits = 10000;
              break;
            default:
              newTotalCredits = 1000;
          }
        }

        plan.totalCredits = newTotalCredits;
        await plan.save();
        console.log(`Updated ${plan.name}: totalCredits = ${newTotalCredits}`);
      } else {
        console.log(
          `${plan.name} already has totalCredits: ${plan.totalCredits}`,
        );
      }
    }

    console.log("Plan update completed");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updatePlans();
