'use server'

import { createClient } from "../../../../utils/server";

export async function deleteCategoryPermanently(categoryId: string) {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", user.id);

  if (deleteError) {
    throw new Error("Failed to delete category permanently");
  }
}

export async function deactivateCategory(categoryId: string) {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: deactivateError } = await supabase
    .from("categories")
    .update({ active: false })
    .eq("id", categoryId)
    .eq("user_id", user.id);

  if (deactivateError) {
    throw new Error("Failed to deactivate category");
  }
}
