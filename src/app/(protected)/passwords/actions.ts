"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/../utils/server";
import { decryptPassword, encryptPassword, verifyMasterPassword } from "@/../utils/crypto";

export async function decryptUserPassword(
  encryptedPassword: string, 
  passwordIv: string, 
  masterPassword: string
) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    throw new Error("User not authenticated");
  }

  // Get vault configuration
  const { data: vaultConfig, error: vaultError } = await supabase
    .from("vault_config")
    .select("salt")
    .eq("user_id", user.id)
    .single();

  if (vaultError || !vaultConfig) {
    throw new Error("Vault configuration not found");
  }

  try {
    // Descifrar usando la función actualizada con IV
    const decrypted = decryptPassword(
      encryptedPassword,
      passwordIv, 
      masterPassword, 
      vaultConfig.salt
    );
    console.log("Decrypted password:", decrypted);
    return decrypted;
  } catch (error) {
    throw new Error("Failed to decrypt password. Invalid master password or corrupted data.");
  }
}

export async function deactivatePassword(passwordId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: updateError } = await supabase
    .from("passwords")
    .update({ active: false })
    .eq("id", passwordId)
    .eq("user_id", user.id);

  if (updateError) {
    throw new Error("Failed to deactivate password");
  }
}

export async function restorePassword(passwordId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: updateError } = await supabase
    .from("passwords")
    .update({ active: true })
    .eq("id", passwordId)
    .eq("user_id", user.id);

  if (updateError) {
    throw new Error("Failed to restore password");
  }
}

export async function deletePasswordPermanently(passwordId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const { error: deleteError } = await supabase
    .from("passwords")
    .delete()
    .eq("id", passwordId)
    .eq("user_id", user.id);

  if (deleteError) {
    throw new Error("Failed to delete password permanently");
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user || error) {
    throw new Error("User not authenticated");
  } 

  const passwordId = formData.get("passwordId") as string;
  const title = formData.get("name") as string;
  const username = formData.get("username") as string;
  const url = formData.get("url") as string;
  const newPassword = formData.get("password") as string | null;
  const masterPassword = formData.get("masterPassword") as string;

  if (!passwordId || !title || !masterPassword) {
    throw new Error("Missing required fields");
  }
  // Get user's vault configuration
  const { data: vaultConfig, error: vaultError } = await supabase
    .from("vault_config")
    .select("salt, master_password_hash")
    .eq("user_id", user.id)
    .single();
  if (vaultError || !vaultConfig) {
    throw new Error("Vault configuration not found. Please set up your master password first.");
  }

  const isValidMasterPassword = await verifyMasterPassword(
    masterPassword, 
    vaultConfig.master_password_hash
  );

  if (!isValidMasterPassword) {
    throw new Error("Invalid master password");
  }

  let updateData: any = {
    title,
    username,
    url,
  };

  if (newPassword) {
    // Encrypt the new password with the VERIFIED master password
    const { encrypted: encryptedPassword, iv } = encryptPassword(newPassword, masterPassword, vaultConfig.salt);
    updateData.password = encryptedPassword;
    updateData.password_iv = iv; 
  }

  const { error: updateError } = await supabase
    .from("passwords")
    .update(updateData)
    .eq("id", passwordId)
    .eq("user_id", user.id);
  if (updateError) {
    throw new Error("Failed to update password: " + updateError.message);
  }
  revalidatePath("/passwords");
  return { success: true };
}

export async function createPassword(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("name") as string;
  const username = formData.get("username") as string;
  const url = formData.get("url") as string;
  const password = formData.get("password") as string;
  const masterPassword = formData.get("masterPassword") as string;
  const categoryId = formData.get("categoryId") as string | null;

  if (!title || !password || !masterPassword) {
    throw new Error("Missing required fields");
  }

  // Get user's vault configuration
  const { data: vaultConfig, error: vaultError } = await supabase
    .from("vault_config")
    .select("salt, master_password_hash")
    .eq("user_id", user.id)
    .single();

  if (vaultError || !vaultConfig) {
    throw new Error("Vault configuration not found. Please set up your master password first.");
  }

  const isValidMasterPassword = await verifyMasterPassword(
    masterPassword, 
    vaultConfig.master_password_hash
  );

  if (!isValidMasterPassword) {
    throw new Error("Invalid master password");
  }

  // Encrypt the password with the VERIFIED master password
  const { encrypted: encryptedPassword, iv } = encryptPassword(password, masterPassword, vaultConfig.salt);

  // Guardar en la base de datos
  const { data, error: insertError } = await supabase
    .from("passwords")
    .insert({
      user_id: user.id,
      title,
      username,
      password: encryptedPassword,
      password_iv: iv, 
      url,
      active: true,
      category_id: categoryId || null,
    })
    .select()
    .single();

    console.log(insertError);

  if (insertError) {
    console.error("Error inserting password:", insertError);
    console.log("data:", data);
    throw new Error("Failed to create password: " + insertError.message);
  }

  revalidatePath("/passwords");
  
  return { success: true, data };
}
