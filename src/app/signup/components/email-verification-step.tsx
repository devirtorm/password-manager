import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "../../../../utils/client";

interface EmailVerificationStepProps {
  email: string;
  onBack: () => void;
}

export default function EmailVerificationStep({
  email,
  onBack,
}: EmailVerificationStepProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/signup/confirm`
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Verification email sent!");
        setResendTimer(60); // 60 second cooldown
      }
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const getEmailProvider = (email: string) => {
    const domain = email.split('@')[1];
    const providers: { [key: string]: { name: string; url: string } } = {
      'gmail.com': { name: 'Gmail', url: 'https://mail.google.com' },
      'yahoo.com': { name: 'Yahoo Mail', url: 'https://mail.yahoo.com' },
      'outlook.com': { name: 'Outlook', url: 'https://outlook.live.com' },
      'hotmail.com': { name: 'Outlook', url: 'https://outlook.live.com' },
      'icloud.com': { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' },
    };
    return providers[domain] || null;
  };

  const emailProvider = getEmailProvider(email);

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <h2 className="text-xl text-gray-900 flex items-center justify-center gap-3">
          Check Your Email
          <Mail className="w-8 h-8 text-indigo-600" />
        </h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            We've sent a verification link to:
          </p>
          <p className="font-semibold text-indigo-600 text-lg">{email}</p>
        </div>
      </div>
      <div className="border bg-indigo-600 border-indigo-200 rounded-lg p-6 text-left ">
        <h3 className="font-semibold mb-3 text-white">What's next?</h3>
        <ol className="space-y-2 text-sm  text-white">
          <li className="flex items-start">
            <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
            Check your inbox (and spam folder)
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
            Click the verification link in the email
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
            Set up your master password to secure your vault
          </li>
        </ol>
      </div>

      {/* Quick Email Access */}
      {emailProvider && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-3">Quick access to your email:</p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(emailProvider.url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open {emailProvider.name}
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleResendEmail}
          disabled={isResending || resendTimer > 0}
          variant="outline"
          className="w-full"
        >
          {isResending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : resendTimer > 0 ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Resend in {resendTimer}s
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend verification email
            </>
          )}
        </Button>

        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to signup
        </Button>
      </div>

      {/* Security Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
        <p className="text-sm text-amber-800">
          <strong>Security Note:</strong> The verification link will expire in 24 hours. 
          If you don't see the email, check your spam folder or request a new one.
        </p>
      </div>
    </div>
  );
}
