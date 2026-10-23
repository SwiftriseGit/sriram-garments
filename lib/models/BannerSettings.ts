import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICouponCard {
  discount: string;
  minOrder: string;
  code: string;
}

export interface IOfferBannerConfig {
  enabled: boolean;
  tagline: string;
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  coupons: ICouponCard[];
}

export interface ISeasonSaleBannerConfig {
  enabled: boolean;
  imageUrl?: string;
  bannerType: "full" | "split";
  tagline: string;
  title: string;
  discountText: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badgeText?: string;
}

export interface IBannerSettings extends Document {
  offerBanner: IOfferBannerConfig;
  seasonSaleBanner: ISeasonSaleBannerConfig;
  updatedAt: Date;
  createdAt: Date;
}

const CouponCardSchema = new Schema<ICouponCard>(
  {
    discount: { type: String, required: true, trim: true, default: "10%" },
    minOrder: { type: String, required: true, trim: true, default: "₹1499" },
    code: { type: String, required: true, trim: true, uppercase: true, default: "SR10" },
  },
  { _id: false }
);

const OfferBannerSchema = new Schema<IOfferBannerConfig>(
  {
    enabled: { type: Boolean, default: true },
    tagline: { type: String, default: "Special Offer" },
    title: { type: String, default: "BUY 2 GET 1" },
    titleHighlight: { type: String, default: "FREE" },
    description: { type: String, default: "On T-Shirts & Casual Wear" },
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/collections" },
    coupons: {
      type: [CouponCardSchema],
      default: [
        { discount: "10%", minOrder: "₹1499", code: "SR10" },
        { discount: "15%", minOrder: "₹2499", code: "SR15" },
        { discount: "20%", minOrder: "₹3999", code: "SR20" },
      ],
      validate: [
        (val: ICouponCard[]) => val.length <= 3,
        "Maximum of 3 coupon cards allowed",
      ],
    },
  },
  { _id: false }
);

const SeasonSaleBannerSchema = new Schema<ISeasonSaleBannerConfig>(
  {
    enabled: { type: Boolean, default: true },
    imageUrl: { type: String, default: "" },
    bannerType: { type: String, enum: ["full", "split"], default: "split" },
    tagline: { type: String, default: "Season Sale" },
    title: { type: String, default: "FLAT" },
    discountText: { type: String, default: "30% OFF" },
    description: { type: String, default: "On Selected Garments" },
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/collections" },
    badgeText: { type: String, default: "Good Style Better Prices" },
  },
  { _id: false }
);

const BannerSettingsSchema = new Schema<IBannerSettings>(
  {
    offerBanner: {
      type: OfferBannerSchema,
      default: () => ({}),
    },
    seasonSaleBanner: {
      type: SeasonSaleBannerSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

export const DEFAULT_BANNER_SETTINGS: {
  offerBanner: IOfferBannerConfig;
  seasonSaleBanner: ISeasonSaleBannerConfig;
} = {
  offerBanner: {
    enabled: true,
    tagline: "Special Offer",
    title: "BUY 2 GET 1",
    titleHighlight: "FREE",
    description: "On T-Shirts & Casual Wear",
    buttonText: "Shop Now",
    buttonLink: "/collections",
    coupons: [
      { discount: "10%", minOrder: "₹1499", code: "SR10" },
      { discount: "15%", minOrder: "₹2499", code: "SR15" },
      { discount: "20%", minOrder: "₹3999", code: "SR20" },
    ],
  },
  seasonSaleBanner: {
    enabled: true,
    imageUrl: "",
    bannerType: "split",
    tagline: "Season Sale",
    title: "FLAT",
    discountText: "30% OFF",
    description: "On Selected Garments",
    buttonText: "Shop Now",
    buttonLink: "/collections",
    badgeText: "Good Style Better Prices",
  },
};

const BannerSettingsModel: Model<IBannerSettings> =
  mongoose.models.BannerSettings ||
  mongoose.model<IBannerSettings>("BannerSettings", BannerSettingsSchema);

export default BannerSettingsModel;
