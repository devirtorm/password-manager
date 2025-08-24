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

export type MasterPasswordFormState =
  | {
      errors?: {
        masterPassword?: string[]
        confirmMasterPassword?: string[]
      }
      message?: string
    }
  | undefined
