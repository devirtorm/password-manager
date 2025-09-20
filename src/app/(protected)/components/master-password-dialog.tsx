"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useMasterPasswordSession } from "../../../hooks/useMasterPasswordSession";
import { PasswordInput } from "@/components/ui/password-input";

interface MasterPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (masterPassword: string) => Promise<void>;
  title?: string;
  description?: string;
}

export function MasterPasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  title = "Enter Master Password",
  description = "Please enter your master password to decrypt this password.",
}: MasterPasswordDialogProps) {
  const [masterPassword, setMasterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { isUnlocked, getCachedPassword, unlock, extendSession } =
    useMasterPasswordSession();

  useEffect(() => {
    if (open && isUnlocked) {
      const cachedPassword = getCachedPassword();
      if (cachedPassword) {
        handleSubmitWithCachedPassword(cachedPassword);
      }
    }
  }, [open, isUnlocked]);

  const handleSubmitWithCachedPassword = async (cachedPassword: string) => {
    setIsLoading(true);
    try {
      await onSubmit(cachedPassword);
      extendSession();
      onOpenChange(false);
    } catch (error) {
      setError(
        "Cached password failed. Please enter your master password again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword.trim()) {
      setError("Master password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSubmit(masterPassword);
      unlock(masterPassword);
      setMasterPassword("");
      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Invalid master password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setMasterPassword("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="master-password">Master Password</Label>
              <PasswordInput
                id="master-password"
                value={masterPassword}
                onChange={(e) => {
                  setMasterPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your master password"
                error={!!error}
                showToggle={true}
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !masterPassword.trim()}
            >
              {isLoading ? "Decrypting..." : "Decrypt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
