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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useMasterPasswordSession } from "../../../hooks/useMasterPasswordSession";
import { masterPasswordCache } from "@/utils/master-password-session";

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
  description = "Please enter your master password to decrypt this password."
}: MasterPasswordDialogProps) {
  const [masterPassword, setMasterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { isUnlocked, getCachedPassword, unlock, extendSession } = useMasterPasswordSession();

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
      setError("Cached password failed. Please enter your master password again.");
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
      setError(error instanceof Error ? error.message : "Invalid master password");
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
              <div className="relative">
                <Input
                  id="master-password"
                  type={showPassword ? "text" : "password"}
                  value={masterPassword}
                  onChange={(e) => {
                    setMasterPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your master password"
                  className={error ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
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
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading || !masterPassword.trim()}>
              {isLoading ? "Decrypting..." : "Decrypt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
