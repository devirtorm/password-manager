'use server'
import { revalidatePath } from "next/cache";
import { createClient } from "../../../utils/server";

export async function deactivatePassword(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("passwords")
    .update({ active: false })
    .eq("id", id)
    .eq("user_id", user?.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/passwords");
  return { success: true };
}
