import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  styleId: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  highlights: string[];
  fabric: string;
  fit: string;
  color: {
    name: string;
    hex: string;
    tone: "dark" | "light";
  };
  sizes: string[];
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  addedRank: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    styleId: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["shirts", "t-shirts", "jeans", "trousers"],
    },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    description: { type: String, default: "" },
    highlights: [{ type: String }],
    fabric: { type: String, default: "" },
    fit: { type: String, default: "" },
    color: {
      name: { type: String, required: true },
      hex: { type: String, required: true },
      tone: { type: String, enum: ["dark", "light"], default: "light" },
    },
    sizes: [{ type: String, enum: ["S", "M", "L", "XL", "XXL"] }],
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    addedRank: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function () {
  if (this.isModified("name") && !this.isModified("slug")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

ProductSchema.index({ category: 1, isPublished: 1 });
ProductSchema.index({ name: "text", description: "text" });

const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
