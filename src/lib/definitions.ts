import { z } from 'zod'

// Signup Form Schema
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Password field must not be empty.' })
    .trim(),
})

export const CategoryFormSchema = z.object({
  categoryId: z.string().uuid({ message: 'Invalid category ID.' }).optional(),
  categoryName: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters long.' })
    .max(100, { message: 'Category name must be at most 100 characters long.' })
    .trim(),
  categoryDescription: z
    .string()
    .max(500, { message: 'Description must be at most 500 characters long.' })
    .trim()
    .nullable(),
  categoryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, {
      message: 'Invalid color format. Please use a hex color code.',
    }),
})

// Master Password Schema (for signup confirmation)
export const MasterPasswordSchema = z.object({
  masterPassword: z
    .string()
    .min(12, { message: 'Master password must be at least 12 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  confirmMasterPassword: z.string().trim(),
}).refine((data) => data.masterPassword === data.confirmMasterPassword, {
  message: "Passwords don't match",
  path: ["confirmMasterPassword"],
})

// Form State Types
export type FormState =
  | {
      errors?: {
        name?: string[]
        last_name?: string[]
        email?: string[]
        password?: string[]
        masterPassword?: string[]
        confirmMasterPassword?: string[]
      }
      message?: string
    }
  | undefined

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type CategoryFormState =
  | {
      errors?: {
        categoryName?: string[]
        categoryDescription?: string[]
        categoryColor?: string[]
      }
      message?: string
      success?: boolean
      inputs?: {
        categoryName?: string
        categoryDescription?: string | null
        categoryColor?: string | null
      }
    }
  | undefined

export type MasterPasswordFormState =
  | {
      errors?: {
        masterPassword?: string[]
        confirmMasterPassword?: string[]
      }
      message?: string
    }
  | undefined
