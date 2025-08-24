import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Specific hooks for each form type
export function usePersonalInfoForm() {
  const personalInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required").min(2, "Must be at least 2 characters"),
    lastName: z.string().min(1, "Last name is required").min(2, "Must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    company: z.string().optional(),
  });

  return useForm({
    resolver: zodResolver(personalInfoSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
}

export function useAccountSecurityForm() {
  const accountSecuritySchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    masterPassword: z.string().min(8, "Master password must be at least 8 characters"),
    confirmMasterPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }).refine((data) => data.masterPassword === data.confirmMasterPassword, {
    message: "Master passwords don't match", 
    path: ["confirmMasterPassword"],
  });

  return useForm({
    resolver: zodResolver(accountSecuritySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
}

export function useLoginForm() {
  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

  return useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
}
