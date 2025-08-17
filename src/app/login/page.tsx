"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { Lock, Mail, Eye, EyeOff, Github } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function getPasswordIcon() {
    if (showPassword) {
      return <EyeOff className="h-4 w-4 text-muted-foreground" />;
    }
    return <Eye className="h-4 w-4 text-muted-foreground" />;
  }

  return (
    <div className="p-3">
      <PageBreadcrumb
        items={[{ label: "Login", icon: <Lock className="h-4 w-4 mr-1" /> }]}
      />
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="p-5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-slate-800">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action={login} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                    >
                      {getPasswordIcon()}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>

                <div>
                  <Button
                    variant="link"
                    className="px-0 py-0 font-normal"
                    asChild
                  >
                    <Link href="/forgot-password">Forgot password?</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    formAction={login}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" className="px-0 font-normal" asChild>
                  <Link href="/register">Create account</Link>
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
