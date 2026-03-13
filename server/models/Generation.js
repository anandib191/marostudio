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
      enum: ["2K", "4K"],
      default: "2K",
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
    sourceImageUrl: String, // user's uploaded product photo (base64 data URL)
    numberOfImages: {
      type: Number,
      default: 1,
    },
    background: String, // environment: studio, city, white, black, etc.
    creatorName: String, // identity / brand name
    aspectRatio: String, // canvas: 9:16, 16:9, 1:1, etc.
    consistentCharacter: {
      type: Boolean,
      default: false,
    }, // persona lock toggle
  },
  { timestamps: true }
);

// Index for admin listing (newest first)
generationSchema.index({ createdAt: -1 });

const Generation = mongoose.model("Generation", generationSchema);

export default Generation;
