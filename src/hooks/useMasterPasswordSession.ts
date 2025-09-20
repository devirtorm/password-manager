import { useState, useEffect } from "react";
import { masterPasswordCache } from "@/utils/master-password-session";
import { verifyMasterPassword } from "../../utils/crypto";
import { createClient } from "../../utils/client";

export function useMasterPasswordSession() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Initial state
    setIsUnlocked(masterPasswordCache.isUnlocked());
    setRemainingTime(masterPasswordCache.getRemainingTime());

    // Listen for vault lock events
    const handleVaultLocked = () => {
      setIsUnlocked(false);
      setRemainingTime(0);
    };

    // Listen for vault unlock events
    const handleVaultUnlocked = () => {
      setIsUnlocked(true);
      setRemainingTime(masterPasswordCache.getRemainingTime());
    };

    // Update remaining time more frequently when close to expiration
    const updateInterval = () => {
      const remaining = masterPasswordCache.getRemainingTime();
      setRemainingTime(remaining);

      if (remaining === 0) {
        setIsUnlocked(false);
      }
    };

    // Check every 10 seconds instead of every minute for better UX
    const interval = setInterval(updateInterval, 10000);

    // Listen for custom vault events
    if (typeof window !== "undefined") {
      window.addEventListener("vault-locked", handleVaultLocked);
      window.addEventListener("vault-unlocked", handleVaultUnlocked);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("vault-locked", handleVaultLocked);
        window.removeEventListener("vault-unlocked", handleVaultUnlocked);
      }
    };
  }, []);

  const unlock = async (password: string) => {
    try {
      const supabase = createClient(); // Ya no necesita await
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        throw new Error("User not authenticated");
      }

      const { data: vaultConfig, error: vaultError } = await supabase
        .from("vault_config")
        .select("salt, master_password_hash")
        .eq("user_id", user.id)
        .single();

      if (vaultError || !vaultConfig) {
        throw new Error(
          "Vault configuration not found. Please set up your master password first."
        );
      }

      const isValid = await verifyMasterPassword(
        password,
        vaultConfig.master_password_hash
      );

      if (!isValid) {
        return false;
      }

      masterPasswordCache.set(password);
      setIsUnlocked(true);
      setRemainingTime(masterPasswordCache.getRemainingTime());

      // Dispatch unlock event for other components
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vault-unlocked"));
      }
      return true;
    } catch (error) {
      console.error("Error unlocking vault:", error);
      return false;
    }
  };

  const lock = () => {
    masterPasswordCache.clear();
    setIsUnlocked(false);
    setRemainingTime(0);

    // Dispatch lock event for other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vault-locked"));
    }
  };

  const extendSession = () => {
    masterPasswordCache.extendSession();
    setRemainingTime(masterPasswordCache.getRemainingTime());
  };

  return {
    isUnlocked,
    remainingTime,
    unlock,
    lock,
    extendSession,
    getCachedPassword: masterPasswordCache.get,
  };
}
