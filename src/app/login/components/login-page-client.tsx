"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { changeTypeInput } from "../../../../utils/show-password";
import { ModeToggle } from "@/components/ui/toggle-theme";

export default function LoginPageClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(login, undefined);
  const router = useRouter();

  // Handle login success or error
  useEffect(() => {
    if (state?.message === "success") {
      toast.success("Login successful!", {
        description: "Redirecting to dashboard...",
      });
      router.push("/dashboard");
    } else if (state?.message) {
      toast.error("Authentication Error", {
        description: state.message,
      });
    }
  }, [state?.message, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function getPasswordIcon() {
    if (showPassword) {
      return <EyeOff className="h-4 w-4 text-indigo-500" />;
    }
    return <Eye className="h-4 w-4 text-indigo-500" />;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-3">
            <span className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </span>
            <span className="text-2xl font-bold text-indigo-500">SignSafe</span>
          </a>
        </div>
        <ModeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900 border-2 shadow-xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Enter your credentials to access your secure vault
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form action={formAction} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="pl-10 h-11 bg-white dark:bg-background border-neutral-300 dark:border-border focus:border-primary transition-colors"
                    />
                  </div>
                  {state?.errors?.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 bg-destructive rounded-full"></span>
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={changeTypeInput(showPassword)}
                      name="password"
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-12 h-11 bg-white dark:bg-background border-neutral-300 dark:border-border focus:border-primary transition-colors"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 hover:bg-neutral-100 dark:hover:bg-muted"
                      onClick={togglePasswordVisibility}
                    >
                      {getPasswordIcon()}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {state?.errors?.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 bg-destructive rounded-full"></span>
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    className="px-0 py-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    asChild
                  >
                    <Link href="/forgot-password">Forgot password?</Link>
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In to Your Vault"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <Separator className="bg-neutral-200 dark:bg-border" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background px-2 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="px-0 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    asChild
                  >
                    <Link href="/signup">Create your vault →</Link>
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
