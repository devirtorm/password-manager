'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'
import { LoginFormSchema, LoginFormState } from '@/lib/definitions'

export async function login(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 2. Prepare data for authentication
  const { email, password } = validatedFields.data

  try {
    const supabase = await createClient()

    // 3. Authenticate user with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        message: 'Invalid credentials. Please check your email and password.',
      }
    }

    // If login successful, revalidate and return success
    revalidatePath('/', 'layout')
    return {
      message: 'success'
    }

  } catch (error) {
    return {
      message: 'An unexpected error occurred. Please try again.' + error,
    }
  }
}

