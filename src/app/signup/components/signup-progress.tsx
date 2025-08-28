"use client";

import { Check, Mail, Shield, User } from "lucide-react";

interface SignupProgressProps {
  currentStep: "signup" | "email-verification" | "master-password";
}

export default function SignupProgress({ currentStep }: SignupProgressProps) {
  const steps = [
    {
      id: "signup",
      name: "Account Info",
      icon: User,
      status: currentStep === "signup" ? "current" : 
              (currentStep === "email-verification" || currentStep === "master-password") ? "completed" : "upcoming"
    },
    {
      id: "email-verification",
      name: "Email Verification",
      icon: Mail,
      status: currentStep === "email-verification" ? "current" :
              currentStep === "master-password" ? "completed" : "upcoming"
    },
    {
      id: "master-password",
      name: "Master Password",
      icon: Shield,
      status: currentStep === "master-password" ? "current" : "upcoming"
    }
  ];

  const getStepClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-indigo-600 text-white border-indigo-600";
      case "current":
        return "bg-indigo-100 text-indigo-600 border-indigo-600";
      case "upcoming":
        return "bg-gray-100 text-gray-400 border-gray-300";
      default:
        return "bg-gray-100 text-gray-400 border-gray-300";
    }
  };

  const getConnectorClasses = (index: number) => {
    const currentStepIndex = steps.findIndex(step => step.status === "current");
    return index < currentStepIndex ? "bg-indigo-600" : "bg-gray-300";
  };

  return (
    <nav aria-label="Progress" className="mb-16">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${getStepClasses(step.status)}`}
                >
                  {step.status === "completed" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                {/* Step Label */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    step.status === "current" 
                      ? "text-indigo-600" 
                      : step.status === "completed"
                      ? "text-indigo-600"
                      : "text-gray-500"
                  }`}>
                    {step.name}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${getConnectorClasses(index)}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
