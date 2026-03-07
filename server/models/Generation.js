import mongoose from "mongoose";

const generationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["photoshoot", "marketing"],
      required: true,
    },
    quality: {
      type: String,
      enum: ["HD", "4K"],
      default: "HD",
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    category: String, // e.g. "women", "men", "kids", "ecommerce"
    productType: String, // e.g. "jewelry", "apparel", "other"
    style: String,
    creditsUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for admin listing (newest first)
generationSchema.index({ createdAt: -1 });

const Generation = mongoose.model("Generation", generationSchema);

export default Generation;
