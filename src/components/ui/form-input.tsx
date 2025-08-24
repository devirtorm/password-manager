import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  className?: string;
  autoComplete?: string;
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  error,
  register,
  className,
  autoComplete,
}: FormInputProps) {
  const hasError = !!error;
  const isValid = !hasError && register;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={cn(
          "text-neutral-700 font-medium text-sm",
          hasError && "text-red-600"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(id)}
          className={cn(
            "h-10 pr-10",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
            isValid && "border-green-500 focus:border-green-500",
            className
          )}
        />
        
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
        )}
        {isValid && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      
      {error && (
        <p className="text-red-600 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
}
