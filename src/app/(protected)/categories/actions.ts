"use server";

import {
  CategoryFormSchema,
  CategoryFormState,
  FormState,
} from "@/lib/definitions";
import { createClient } from "../../../../utils/server";
import { revalidatePath } from "next/cache";

export async function deleteCategoryPermanently(categoryId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", user.id);

    revalidatePath("/categories");

  if (deleteError) {
    throw new Error("Failed to delete category permanently");
  }
}

export async function createCategory(
  initialState: any,
  formData: FormData
): Promise<CategoryFormState> {
  const rawData = {
    categoryName: formData.get("categoryName")?.toString() ?? undefined,
    categoryDescription:
      formData.get("categoryDescription")?.toString() ?? undefined,
    categoryColor: formData.get("categoryColor")?.toString() ?? undefined,
  };

  // Validar los campos usando el schema
  const validatedFields = CategoryFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }

  const { categoryName, categoryDescription, categoryColor } =
    validatedFields.data;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return {
      message: "User not authenticated",
    };
  }

  try {
    const { error: insertError } = await supabase
      .from("categories")
      .insert({
        user_id: user.id,
        name: categoryName,
        description: categoryDescription,
        color: categoryColor,
      })
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        message: "Failed to create category: " + insertError.message,
      };
    }

    revalidatePath("/categories");

    return {
      success: true,
      message: "Category created successfully",
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function deactivateCategory(categoryId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: deactivateError } = await supabase
    .from("categories")
    .update({ active: false })
    .eq("id", categoryId)
    .eq("user_id", user.id);

  revalidatePath("/categories");

  if (deactivateError) {
    throw new Error("Failed to deactivate category");
  }
}
