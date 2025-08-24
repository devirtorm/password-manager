"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { signup } from "../actions";
import { Eye, EyeOff, Lock, Mail, User, UserCheck } from "lucide-react";
import {
  changeTypeInput,
  getPasswordIcon,
} from "../../../../utils/show-password";

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);

  // Use useEffect to call onSuccess when signup is successful
  useEffect(() => {
    if (state?.message === "success") {
      onSuccess();
    }
  }, [state?.message, onSuccess]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    getPasswordIcon(!showPassword);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && state.message !== "success" && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.message}
        </div>
      )}
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-medium">
          Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-indigo-500" />
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            required
            className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {state?.errors?.name && (
          <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Last Name Field */}
      <div className="space-y-2">
        <Label htmlFor="last_name" className="text-gray-700 font-medium">
          Last Name
        </Label>
        <div className="relative">
          <UserCheck className="absolute left-3 top-3 h-4 w-4 text-indigo-500" />
          <Input
            id="last_name"
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            required
            className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {state?.errors?.last_name && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.last_name[0]}
          </p>
        )}
      </div>

      {/* Email Field */}
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
          <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 font-medium">
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
            {getPasswordIcon(!showPassword)}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {state?.errors?.password && (
          <div className="mt-1">
            <p className="text-sm text-red-600 mb-1">Password must:</p>
            <ul className="text-sm text-red-600 space-y-1">
              {state.errors.password.map((error) => (
                <li key={error}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3">
        <Checkbox id="terms" name="terms" required className="mt-1" />
        <div className="text-sm text-gray-600 leading-relaxed">
          <Label htmlFor="terms" className="cursor-pointer">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              Privacy Policy
            </Link>
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3"
        size="lg"
        disabled={isPending}
      >
        {isPending ? "Creating Account..." : "Create Your Account"}
      </Button>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
