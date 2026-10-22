import mongoose, { Schema, Document, Model } from "mongoose";

// ──────────────────────────────────────────────
// Product Model — store inventory
// ──────────────────────────────────────────────

export interface IProduct extends Document {
  name: string;
  slug: string;
  styleId: string;
  category: string;
  originalPrice: number;
  salePrice: number | null;
  isSale: boolean;
  discountPercent: number;
  couponCode: string | null;
  couponDiscount: number | null;
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
  // Virtual
  price: number;
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

    // ── Pricing ──
    originalPrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },
    isSale: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    couponCode: { type: String, default: null, trim: true, uppercase: true },
    couponDiscount: { type: Number, default: null, min: 0 },

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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Auto-calculate discountPercent when saving ──
ProductSchema.pre("save", function () {
  // Auto-generate slug from name
  if (this.isModified("name") && !this.isModified("slug")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Auto-calculate discount percent
  if (this.isSale && this.salePrice != null && this.originalPrice > 0) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.salePrice) / this.originalPrice) * 100
    );
  } else {
    this.discountPercent = 0;
  }
});

// ── Virtual: "price" returns the effective selling price ──
ProductSchema.virtual("price").get(function () {
  if (this.isSale && this.salePrice != null) {
    return this.salePrice;
  }
  return this.originalPrice;
});

ProductSchema.index({ category: 1, isPublished: 1 });
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ isSale: 1 });

const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
