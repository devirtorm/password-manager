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
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { changeTypeInput } from "../../../../utils/show-password";

export default function LoginPageClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(login, undefined);
  const router = useRouter();

  // Handle login success or error
  useEffect(() => {
    if (state?.message === 'success') {
      toast.success("Login successful!", {
        description: "Redirecting to dashboard...",
      });
      router.push('/dashboard');
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
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your vault
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8">
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-indigo-500" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  {state?.errors?.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label> 
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-indigo-500" />
                    <Input
                      id="password"
                      type={changeTypeInput(showPassword)}
                      name="password"
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-indigo-500"
                      onClick={togglePasswordVisibility}
                    >
                      {getPasswordIcon()}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {state?.errors?.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    className="px-0 py-0 font-normal text-indigo-600 hover:text-indigo-500"
                    asChild
                  >
                    <Link href="/forgot-password">Forgot password?</Link>
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? "Iniciando sesión..." : "Sign In to Your Vault"}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <Separator className="bg-gray-200" />
              </div>

              {/* Sign Up Link */}
              <div className="mt-2 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="px-0 font-medium text-indigo-600 hover:text-indigo-500"
                    asChild
                  >
                    <Link href="/signup">Create your vault</Link>
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
