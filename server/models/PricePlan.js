import mongoose from "mongoose";

const pricePlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    yearlyPrice: { type: String, required: true },
    description: { type: String, default: "" },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    // Unified credit system
    totalCredits: { type: Number, default: 0, min: 0 }, // Total unified credits per month
  },
  { timestamps: true },
);

// Ensure only one plan can be popular at a time
pricePlanSchema.pre("save", async function (next) {
  if (this.isPopular && this.isModified("isPopular")) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isPopular: false } },
    );
  }
  next();
});

export const DEFAULT_PLANS = [
  {
    name: "Silver",
    price: "49",
    yearlyPrice: "40",
    description: "For early brands and creators",
    features: [
      "Access to model library",
      "Background presets",
      "Max upload file size: 10 MB",
      "Max output resolution: 2K (up to 1080px)",
      "No watermark",
      "Regenerations per image: 1",
      "Edits per image: 1",
      "Email Support within 48 hours",
    ],
    isPopular: false,
    totalCredits: 1000,
  },
  {
    name: "Gold",
    price: "59",
    yearlyPrice: "47",
    description: "For growing teams",
    features: [
      "Access to model library",
      "Background presets",
      "Max upload file size: 10 MB",
      "Max output resolution: 4K",
      "No watermark",
      "Regenerations per image: 2",
      "Edits per image: 1",
      "Email Support within 24 hours",
    ],
    isPopular: true,
    totalCredits: 2500,
  },
  {
    name: "Platinum",
    price: "68",
    yearlyPrice: "54",
    description: "For high-velocity teams",
    features: [
      "Access to model library",
      "Background presets",
      "Max upload file size: 10 MB",
      "Max output resolution: 4K",
      "No watermark",
      "Regenerations per image: 3",
      "Edits per image: 1",
      "Email Support within 12 hours",
    ],
    isPopular: false,
    totalCredits: 10000,
  },
];

const PricePlan = mongoose.model("PricePlan", pricePlanSchema);

export default PricePlan;
