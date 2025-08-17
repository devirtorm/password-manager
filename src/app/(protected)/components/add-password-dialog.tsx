"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { useState } from "react";
import { createPassword } from "../passwords/actions";
import { get } from "http";
import {
  changeTypeInput,
  getPasswordIcon,
} from "../../../../utils/show-password";

interface AddPasswordDialogProps {
  children: React.ReactNode;
}

export function AddPasswordDialog({ children }: AddPasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    getPasswordIcon(!showPassword);
  };

  const toggleMasterPasswordVisibility = () => {
    setShowMasterPassword(!showMasterPassword);
    getPasswordIcon(!showMasterPassword);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={createPassword}>
          <DialogHeader>
            <DialogTitle>Add Password</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Title</Label>
              <Input id="name-1" name="name" placeholder="ex: My Email" />
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
