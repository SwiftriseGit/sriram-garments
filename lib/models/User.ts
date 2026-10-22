import mongoose, { Schema, Document, Model } from "mongoose";

// ──────────────────────────────────────────────
// User Model — customers who shop on the store
// ──────────────────────────────────────────────

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  role: "customer" | "admin";
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    avatar: String,
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── Password hashing (PBKDF2 via Web Crypto — same pattern as Admin) ──
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(this.password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  const hash = Buffer.from(bits).toString("hex");
  const saltHex = Buffer.from(salt).toString("hex");
  this.password = `${saltHex}:${hash}`;
});

UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  const [saltHex, storedHash] = this.password.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(candidate),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  const hash = Buffer.from(bits).toString("hex");
  return hash === storedHash;
};

UserSchema.index({ firstName: "text", lastName: "text" });

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
