import * as z from "zod/v4";

// ──────────────────────────────────────────────
// Validation Schemas — Zod 4
// ──────────────────────────────────────────────

export const SignupSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long")
    .trim(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long")
    .trim(),
  email: z
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9+\-\s]+$/, "Phone number can only contain digits, +, - and spaces")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

export const LoginSchema = z.object({
  email: z
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const AddressSchema = z.object({
  label: z.string().trim().max(30).default("Home"),
  line1: z.string().trim().min(3, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z
    .string()
    .trim()
    .min(5, "Pincode must be at least 5 digits")
    .max(10)
    .regex(/^[0-9]+$/, "Pincode must be numeric"),
  isDefault: z.boolean().default(false),
});

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(2).max(50).trim().optional(),
  lastName: z.string().min(2).max(50).trim().optional(),
  phone: z
    .string()
    .min(10)
    .max(15)
    .regex(/^[0-9+\-\s]+$/)
    .trim()
    .optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
});

export const ResetPasswordSchema = z
  .object({
    email: z
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
    otp: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^[0-9]+$/, "Verification code must be numbers only"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Type exports ──
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// ── Form state type for useActionState ──
export type AuthFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;

