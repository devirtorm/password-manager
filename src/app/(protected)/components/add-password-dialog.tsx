"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useActionState } from "react";
import { createPassword } from "../passwords/actions";
import { toast } from "sonner";
import { useMasterPasswordSession } from "../../../hooks/useMasterPasswordSession";
import { masterPasswordCache } from "@/utils/master-password-session";
import {
  changeTypeInput,
  getPasswordIcon,
} from "../../../../utils/show-password";

interface FormState {
  message?: string;
  error?: string;
}

interface AddPasswordDialogProps {
  children: React.ReactNode;
}

export function AddPasswordDialog({ children }: AddPasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [open, setOpen] = useState(false);
  
  const { isUnlocked, getCachedPassword, unlock, extendSession } = useMasterPasswordSession();
  
  const [state, formAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        // Si hay una master password en cache, usarla automáticamente
        if (isUnlocked) {
          const cachedPassword = getCachedPassword();
          if (cachedPassword) {
            formData.set('masterPassword', cachedPassword);
            extendSession(); // Extend session on use
          }
        }
        
        const result = await createPassword(formData);
        return { success: true, message: "Password added successfully!" };
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : "Failed to add password" 
        };
      }
    },
    { success: false, message: "" }
  );

  // Handle success/error states
  useEffect(() => {
    if (state?.success) {
      toast.success("Password Added", {
        description: "Your password has been securely saved.",
      });
      setOpen(false);
      // Reset form states
      setShowPassword(false);
      setShowMasterPassword(false);
    } else if (state?.message && !state.success) {
      toast.error("Error", {
        description: state.message,
      });
    }
  }, [state]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    getPasswordIcon(!showPassword);
  };

  const toggleMasterPasswordVisibility = () => {
    setShowMasterPassword(!showMasterPassword);
    getPasswordIcon(!showMasterPassword);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add Password</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Title</Label>
              <Input id="name-1" name="name" placeholder="ex: My Email" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Email or Username</Label>
              <Input
                id="username-1"
                name="username"
                placeholder="ex: user@example.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url-1">URL</Label>
              <Input
                id="url-1"
                name="url"
                placeholder="ex: https://example.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-1">Password</Label>
              <div className="relative">
                <Input
                  id="password-1"
                  name="password"
                  placeholder="ex: mypassword123."
                  type={changeTypeInput(showPassword)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {getPasswordIcon(showPassword)}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Solo mostrar el campo de master password si no está en cache */}
          {!isUnlocked && (
            <div className="grid gap-3 my-2 border p-3 rounded-sm bg-indigo-50/50">
              <div className="grid gap-3">
                <Label htmlFor="master-password">Master Password</Label>
                <div className="relative">
                  <Input
                    className="bg-white"
                    id="master-password"
                    name="masterPassword"
                    placeholder="Enter your master password"
                    type={changeTypeInput(showMasterPassword)}
                    required
                    onChange={(e) => {
                      // Guardar la master password en cache cuando se escribe
                      if (e.target.value.length > 0) {
                        unlock(e.target.value);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={toggleMasterPasswordVisibility}
                  >
                    {getPasswordIcon(showMasterPassword)}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required to encrypt your password securely
                </p>
              </div>
            </div>
          )}
          
          {/* Mostrar información cuando la master password está en cache */}
          {isUnlocked && (
            <div className="grid gap-3 my-2 border p-3 rounded-sm bg-green-50/50 border-green-200">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Eye className="h-4 w-4" />
                <span>Master password is cached for this session</span>
              </div>
              <p className="text-xs text-green-600">
                Your passwords will be encrypted automatically. Cache will clear when you refresh the page.
              </p>
              {/* Campo oculto para enviar la master password */}
              <input type="hidden" name="masterPassword" value={getCachedPassword() || ""} />
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
