"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clipboard, RefreshCw, Save } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

export default function PasswordGeneratorCard() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const copyToClipboard = async () => {
    if (!password) {
      toast.error("No password to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!", {
        style: {
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          border: "none",
          color: "white",
        },
      });
    } catch (error) {
      toast.error("Failed to copy password");
    }
  };

  const generatePassword = useCallback(() => {
    const chars = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let availableChars = "";
    if (options.uppercase) availableChars += chars.uppercase;
    if (options.lowercase) availableChars += chars.lowercase;
    if (options.numbers) availableChars += chars.numbers;
    if (options.symbols) availableChars += chars.symbols;

    if (availableChars === "") {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += availableChars.charAt(
        Math.floor(Math.random() * availableChars.length)
      );
    }

    setPassword(result);
    toast.success("Password generated successfully!");
  }, [length, options]);
  const getPasswordStrength = () => {
    if (!password)
      return { strength: 0, label: "No password", color: "bg-gray-300" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (score <= 4)
      return { strength: 50, label: "Medium", color: "bg-yellow-500" };
    if (score <= 5)
      return { strength: 75, label: "Strong", color: "bg-green-500" };
    return { strength: 100, label: "Very Strong", color: "bg-green-600" };
  };
  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };
  const strengthInfo = getPasswordStrength();
  return (
    <Card>
      <CardContent className="p-8">
        <div className="mb-8">
          <Label className="block text-sm font-medium mb-3">
            Generated Password
          </Label>
          <div className="relative">
            <div className="bg-neutral-100 text-neutral-800 p-4 rounded-lg font-mono text-xl text-center border-2 border-gray-200 min-h-[60px] flex items-center justify-center dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700">
              <span className="break-all">
                {password || "Click 'Generate' to create a password"}
              </span>
            </div>
            <Button
              disabled={!password}
              variant="outline"
              onClick={copyToClipboard}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 rounded text-sm disabled:opacity-50"
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <Label className="block text-sm font-medium">
              Length: {length} characters
            </Label>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4</span>
              <span>50</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="block text-sm font-medium">Strength</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                  style={{ width: `${strengthInfo.strength}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{strengthInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={options.uppercase}
              onCheckedChange={() => handleOptionChange("uppercase")}
            />
            <Label htmlFor="uppercase" className="text-sm cursor-pointer">
              Uppercase (A-Z)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={options.lowercase}
              onCheckedChange={() => handleOptionChange("lowercase")}
            />
            <Label htmlFor="lowercase" className="text-sm cursor-pointer">
              Lowercase (a-z)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={options.numbers}
              onCheckedChange={() => handleOptionChange("numbers")}
            />
            <Label htmlFor="numbers" className="text-sm cursor-pointer">
              Numbers (0-9)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={options.symbols}
              onCheckedChange={() => handleOptionChange("symbols")}
            />
            <Label htmlFor="symbols" className="text-sm cursor-pointer">
              Symbols (!@#$)
            </Label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant={"default"}
            onClick={generatePassword}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Password
          </Button>
          <Button
            disabled={!password}
            variant="outline"
            className="flex-1 py-3 px-6"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
