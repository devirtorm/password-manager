"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, CheckCircle, X, Lock } from "lucide-react";

interface MasterPasswordSetupProps {
  onSubmit: (masterPassword: string) => void;
}

export default function MasterPasswordSetup({ onSubmit }: MasterPasswordSetupProps) {
  const [masterPassword, setMasterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const passwordRequirements = [
    { text: "At least 12 characters", check: (pwd: string) => pwd.length >= 12 },
    { text: "Contains uppercase letter", check: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: "Contains lowercase letter", check: (pwd: string) => /[a-z]/.test(pwd) },
    { text: "Contains number", check: (pwd: string) => /\d/.test(pwd) },
    { text: "Contains special character", check: (pwd: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd) },
  ];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!masterPassword) {
      newErrors.masterPassword = "Master password is required";
    } else {
      const failedRequirements = passwordRequirements.filter(req => !req.check(masterPassword));
      if (failedRequirements.length > 0) {
        newErrors.masterPassword = "Password does not meet all requirements";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your master password";
    } else if (masterPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(masterPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setMasterPassword(value);
    if (errors.masterPassword) {
      setErrors(prev => ({ ...prev, masterPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800 mb-1">Important Security Information</p>
            <p className="text-amber-700">
              Your master password is the only key to your vault. We cannot recover it if you forget it. 
              Make sure it's strong and memorable.
            </p>
          </div>
        </div>
      </div>

      {/* Master Password */}
      <div className="space-y-2">
        <Label htmlFor="masterPassword">Master Password</Label>
        <div className="relative">
          <Input
            id="masterPassword"
            type={showPassword ? "text" : "password"}
            value={masterPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={errors.masterPassword ? "border-red-500 pr-10" : "pr-10"}
            placeholder="Create a strong master password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.masterPassword && (
          <p className="text-sm text-red-500">{errors.masterPassword}</p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
        <div className="space-y-2">
          {passwordRequirements.map((requirement, index) => {
            const isValid = requirement.check(masterPassword);
            return (
              <div key={index} className="flex items-center space-x-2">
                {isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-gray-300" />
                )}
                <span className={`text-sm ${isValid ? 'text-green-700' : 'text-gray-500'}`}>
                  {requirement.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Master Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
            placeholder="Confirm your master password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3"
        disabled={isLoading}
      >
        {isLoading ? "Setting up your vault..." : "Create My Secure Vault"}
      </Button>

      {/* Additional Security Note */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500">
            <Lock className="w-3 h-3 text-white" />
          </span>
          Your master password is encrypted and stored securely
        </p>
        <p className="flex items-center justify-center gap-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500">
            <EyeOff className="w-3 h-3 text-white" />
          </span>
          We use end-to-end encryption - even we can't see your passwords
        </p>
      </div>
    </form>
  );
}
