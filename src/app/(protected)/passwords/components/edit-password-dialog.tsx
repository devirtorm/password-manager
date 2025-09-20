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
import { Eye, EyeOff, Pen, Pencil } from "lucide-react";
import { useState, useEffect, useActionState, use } from "react";
import { toast } from "sonner";
import { masterPasswordCache } from "@/utils/master-password-session";
import { Category } from "@/app/types/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  changeTypeInput,
  getPasswordIcon,
} from "../../../../../utils/show-password";
import { getCategories } from "../../categories/actions";
import { createPassword, updatePassword } from "../actions";
import { useMasterPasswordSession } from "@/hooks/useMasterPasswordSession";
import { Password } from "@/app/types/password";
import { MasterPasswordDialog } from "../../components/master-password-dialog";

interface FormState {
  message?: string;
  error?: string;
}

interface AddPasswordDialogProps {
  children: React.ReactNode;
  password: Password;
}

export function EditPasswordDialog({
  children,
  password,
}: AddPasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const { isUnlocked, getCachedPassword, unlock, extendSession } =
    useMasterPasswordSession();

  const [state, formAction, isPending] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      try {
        if (isUnlocked) {
          const cachedPassword = getCachedPassword();
          if (cachedPassword) {
            formData.set("masterPassword", cachedPassword);
            extendSession(); // Extend session on use
          }
        }

        const result = await updatePassword(formData);
        return { success: true, message: "Password updated successfully!" };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Error updating password",
        };
      }
    },
    { success: false, message: "" }
  );
  useEffect(() => {
    if (!open) {
      setShowPassword(false);
      setShowMasterPassword(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
      };
      fetchCategories();
    }
  }, [open]);

  // Handle success/error states
  useEffect(() => {
    if (state?.success) {
      toast.success("Password Updated", {
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

  const handleUnlockSubmit = async (masterPassword: string) => {
    try {
      // Validar que la contraseña maestra no esté vacía
      if (!masterPassword || masterPassword.trim() === "") {
        throw new Error("Master password is required");
      }

      // Validar longitud mínima
      if (masterPassword.length < 8) {
        throw new Error("Invalid master password");
      }

      // Intentar desbloquear usando el hook
      unlock(masterPassword);

      if (!isUnlocked) {
        throw new Error("Invalid master password");
      }

      // Si llegamos aquí, la validación fue exitosa
      return Promise.resolve();
    } catch (error) {
      // Propagar el error para que MasterPasswordDialog lo maneje
      throw error;
    }
  };

  if (!isUnlocked) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <MasterPasswordDialog
          open={open}
          onOpenChange={setOpen}
          onSubmit={handleUnlockSubmit}
          title="Enter Master Password"
          description="Please enter your master password to edit this password."
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-4xl">
        <form action={formAction}>
          <input type="hidden" name="passwordId" value={password.id} />
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription className="mb-4">
              Update your password details below and save securely.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Title</Label>
              <Input
                id="name-1"
                name="name"
                defaultValue={password.title}
                placeholder="ex: My Email"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Email or Username</Label>
              <Input
                id="username-1"
                name="username"
                defaultValue={password.username}
                placeholder="ex: user@example.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url-1">URL</Label>
              <Input
                id="url-1"
                name="url"
                defaultValue={password.url}
                placeholder="ex: https://example.com"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-1">Password</Label>
              <div className="relative">
                <Input
                  id="password-1"
                  name="password"
                  placeholder="Your password is encrypted"
                  type={changeTypeInput(showPassword)}
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
            <div className="grid gap-3">
              <Label htmlFor="category">Category</Label>
              <Select
                name="categoryId"
                defaultValue={password.category_id || ""}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              <Pencil className="h-4 w-4 mr-2" />
              {isPending ? "Saving..." : "Edit Password "}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
