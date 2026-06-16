import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allows null/missing values while enforcing uniqueness on existing ones
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // 🖼️ Multiple Images Structure
    images: {
      thumbnail: {
        type: String,
        required: true, // Every product needs at least a cover image
      },
      gallery: {
        type: [String], // Array of additional image asset URLs
        default: [],
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
productSchema.index({ name: "text", description: "text" });
export const Product = mongoose.model("Product", productSchema);
