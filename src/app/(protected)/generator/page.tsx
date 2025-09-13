"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clipboard, OctagonX, RefreshCw, Save } from "lucide-react";

import CardTipsGenerator from "./components/card-tips-generator";
import PasswordGeneratorCard from "./components/password-generator-card";

export default function GeneratePasswordPage() {


  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate Password</h1>
        <p className="text-muted-foreground">
          Create secure and customized passwords to protect your accounts
        </p>
      </div>
      <PasswordGeneratorCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardTipsGenerator />
      </div>
    </div>
  );
}
