"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import SignupForm from "./signup-form";
import EmailVerificationStep from "./email-verification-step";
import SignupProgress from "./signup-progress";

type SignupStep = "signup" | "email-verification";

export default function SignupPageClient() {
  const [currentStep, setCurrentStep] = useState<SignupStep>("signup");

  const handleSignupSuccess = () => {
    setCurrentStep("email-verification");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "signup":
        return "Create your account";
      default:
        return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "signup":
        return <SignupForm onSuccess={handleSignupSuccess} />;

      case "email-verification":
        return (
          <EmailVerificationStep
            email=""
            onBack={() => setCurrentStep("signup")}
          />
        );

      default:
        return null;
    }
  }; 

  
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
          <div className="text-center mb-8">
            <SignupProgress currentStep={currentStep} />
          </div>

          <Card className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {getStepTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8">{renderStep()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
