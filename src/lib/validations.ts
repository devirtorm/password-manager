import { z } from "zod";

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const nameSchema = z
  .string()
  .min(1, "This field is required")
  .min(2, "Must be at least 2 characters")
  .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character");

// Form-specific schemas
export const personalInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  company: z.string().optional(),
});

export const accountSecuritySchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  masterPassword: passwordSchema,
  confirmMasterPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.masterPassword === data.confirmMasterPassword, {
  message: "Master passwords don't match", 
  path: ["confirmMasterPassword"],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  description: z.string().max(200, "Description too long").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
});

export const passwordEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  username: z.string().max(100, "Username too long").optional(),
  password: z.string().min(1, "Password is required"),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  notes: z.string().max(500, "Notes too long").optional(),
  categoryId: z.string().optional(),
});

// Export types
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type AccountSecurityData = z.infer<typeof accountSecuritySchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type CategoryData = z.infer<typeof categorySchema>;
export type PasswordEntryData = z.infer<typeof passwordEntrySchema>;
