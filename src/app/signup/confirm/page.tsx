"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "../../../../utils/client";
import { hashMasterPassword, generateSalt } from "../../../../utils/crypto";
import MasterPasswordSetup from "./components/master-password-setup";
import LoadingScreen from "./components/loading-screen";
import SignupProgress from "../components/signup-progress";
import { X } from "lucide-react";

export default function SignupConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        if (!tokenHash || type !== "email") {
          setError("Invalid verification link");
          setIsVerifying(false);
          return;
        }

        const supabase = createClient();

        // Verify the email
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "email",
        });

        if (verifyError) {
          setError(verifyError.message);
          setIsVerifying(false);
          return;
        }

        if (data.user) {
          // Check if user profile already exists
          const { data: existingProfile } = await supabase
            .from("user_profiles")
            .select("id")
            .eq("user_id", data.user.id)
            .single();

          // Create user profile if it doesn't exist
          if (!existingProfile) {
            const userName =
              data.user.user_metadata?.name ||
              data.user.email?.split("@")[0] ||
              "User";

            const { error: profileError } = await supabase
              .from("user_profiles")
              .insert({
                id: data.user.id,
                user_id: data.user.id,
                first_name: userName.split(" ")[0] || userName,
                last_name: userName.split(" ").slice(1).join(" ") || "",
                avatar_url: null,
                created_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error("Error creating profile:", profileError);
            }
          }

          setIsVerified(true);
          toast.success("Email verified successfully!");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("An error occurred during verification");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleMasterPasswordSetup = async (masterPassword: string) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not found");
        return;
      }

      // Hash the master password properly
      const { hash: masterPasswordHash } = await hashMasterPassword(masterPassword);
      
      // Generate crypto salt for encryption/decryption operations
      const cryptoSalt = generateSalt();

      // Create vault configuration with properly hashed password
      try {
        const { error: vaultError } = await supabase
          .from("vault_config")
          .insert({
            id: crypto.randomUUID(),
            user_id: user.id,
            master_password_hash: masterPasswordHash, // Now properly hashed
            salt: cryptoSalt, // Proper crypto salt
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (vaultError) {
          console.error("Vault creation error:", vaultError);
          toast.error("Failed to create vault configuration");
          return;
        }

        toast.success("Account setup completed! Your master password is now securely encrypted.");
        router.push("/dashboard");
      } catch (vaultError) {
        console.error("Vault creation error:", vaultError);
        toast.error("An error occurred during vault setup");
      }
    } catch (error) {
      console.error("Master password setup error:", error);
      toast.error("An error occurred during setup");
    }
  };

  if (isVerifying) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="space-x-3 flex items-center justify-center my-4">
                <a href="/" className="flex items-center space-x-3">
                  <span className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </span>
                  <span className="text-3xl font-bold text-indigo-500">
                    SignSafe
                  </span>
                </a>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => router.push("/signup")}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Back to Signup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <>
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-3">
              <span className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </span>
              <span className="text-2xl font-bold text-indigo-500">
                SignSafe
              </span>
            </a>
          </div>
        </div>
        <div className="min-h-screen  flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-15">
              <SignupProgress currentStep="master-password" />
            </div>

            <Card className="backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Setup Your Master Password
                </h3>
                <CardDescription>
                  Create a strong master password to secure your vault
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <MasterPasswordSetup onSubmit={handleMasterPasswordSetup} />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return null;
}
