"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import { SignupFormSchema, FormState } from "@/lib/definitions";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form fields first
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion
  const { name, last_name, email, password } = validatedFields.data;

  try {
    const supabase = await createClient();

    // 3. Create user with Supabase - it will automatically check if user exists
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          display_name: name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup/confirm`,
      },
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes("User already registered")) {
        return {
          message: "A user with this email already exists.",
        };
      }

      if (error.message.includes("Invalid email")) {
        return {
          errors: {
            email: ["Please enter a valid email address."],
          },
        };
      }

      if (error.message.includes("Password")) {
        return {
          errors: {
            password: ["Password does not meet requirements."],
          },
        };
      }

      return {
        message:
          "An error occurred while creating your account. Please try again.",
      };
    }

    if (!data.user) {
      return {
        message: "An error occurred while creating your account.",
      };
    }

    // Save user profile to user_profiles table
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          user_id: data.user.id,
          first_name: name,
          last_name: last_name,
          avatar_url: null,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
    }

    return {
      message: "success",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
