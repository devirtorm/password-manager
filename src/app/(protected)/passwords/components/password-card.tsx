import { Password } from "@/app/types/password";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Copy,
  Edit,
  Eye,
  EyeOff,
  Files,
  Globe,
  Link2,
  Loader2,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  X,
  User,
  Lock,
  Calendar,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MasterPasswordDialog } from "../../components/master-password-dialog";
import { decryptUserPassword } from "../actions";
import { useMasterPasswordSession } from "@/hooks/useMasterPasswordSession";

interface PasswordCardProps {
  password: Password;
  onEdit: (password: Password) => void;
  onDeactivate?: (passwordId: string) => void;
  onRestore?: (passwordId: string) => void;
  onPermanentDelete?: (passwordId: string) => void;
}

export default function PasswordCard({
  password,
  onEdit,
  onDeactivate,
  onRestore,
  onPermanentDelete,
}: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  );
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showMasterPasswordDialog, setShowMasterPasswordDialog] =
    useState(false);
  const [pendingAction, setPendingAction] = useState<"show" | "copy" | null>(
    null
  );

  const { isUnlocked, getCachedPassword } = useMasterPasswordSession();

  // Reset password visibility when vault is locked
  useEffect(() => {
    if (!isUnlocked) {
      setShowPassword(false);
      setDecryptedPassword(null);
      setIsDecrypting(false);
      setShowMasterPasswordDialog(false);
      setPendingAction(null);
    }
  }, [isUnlocked]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error(`Failed to copy ${type.toLowerCase()}`);
    }
  };

  const handleCopyUsername = () => {
    // Check if vault is locked
    if (!isUnlocked) {
      toast.error("Vault is locked. Please unlock to copy username.");
      return;
    }
    copyToClipboard(password.username || "", "Username");
  };

  const handleDecryptWithMasterPassword = async (masterPassword: string) => {
    setIsDecrypting(true);
    try {
      const decrypted = await decryptUserPassword(
        password.password,
        password.password_iv || "",
        masterPassword
      );
      setDecryptedPassword(decrypted);

      if (pendingAction === "show") {
        setShowPassword(true);
      } else if (pendingAction === "copy") {
        await copyToClipboard(decrypted, "Password");
      }
    } catch (error) {
      toast.error(
        "Failed to decrypt password. Please check your master password."
      );
      throw error;
    } finally {
      setIsDecrypting(false);
      setPendingAction(null);
    }
  };

  const handleShowPassword = async () => {
    // Check if vault is locked
    if (!isUnlocked) {
      toast.error("Vault is locked. Please unlock to view passwords.");
      return;
    }

    if (showPassword) {
      setShowPassword(false);
      return;
    }

    if (decryptedPassword) {
      setShowPassword(true);
      return;
    }

    // If vault is unlocked, try to use cached password automatically
    const cachedPassword = getCachedPassword();
    if (cachedPassword) {
      setIsDecrypting(true);
      try {
        const decrypted = await decryptUserPassword(
          password.password,
          password.password_iv || "",
          cachedPassword
        );
        setDecryptedPassword(decrypted);
        setShowPassword(true);
      } catch (error) {
        // If cached password fails, show dialog
        setPendingAction("show");
        setShowMasterPasswordDialog(true);
      } finally {
        setIsDecrypting(false);
      }
    } else {
      // No cached password available, show dialog
      setPendingAction("show");
      setShowMasterPasswordDialog(true);
    }
  };

  const handleCopyPassword = async () => {
    // Check if vault is locked
    if (!isUnlocked) {
      toast.error("Vault is locked. Please unlock to copy passwords.");
      return;
    }

    if (decryptedPassword) {
      await copyToClipboard(decryptedPassword, "Password");
      return;
    }

    // If vault is unlocked, try to use cached password automatically
    const cachedPassword = getCachedPassword();
    if (cachedPassword) {
      setIsDecrypting(true);
      try {
        const decrypted = await decryptUserPassword(
          password.password,
          password.password_iv || "",
          cachedPassword
        );
        setDecryptedPassword(decrypted);
        await copyToClipboard(decrypted, "Password");
      } catch (error) {
        // If cached password fails, show dialog
        setPendingAction("copy");
        setShowMasterPasswordDialog(true);
      } finally {
        setIsDecrypting(false);
      }
    } else {
      // No cached password available, show dialog
      setPendingAction("copy");
      setShowMasterPasswordDialog(true);
    }
  };

  // Calculate password age for visual indication
  const passwordAge = Math.floor(
    (Date.now() - new Date(password.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const isOldPassword = passwordAge > 180; // 6 months

  // Extract domain from URL for favicon
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  };

  const domain = password.url ? getDomain(password.url) : null;

  return (
    <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header with favicon and title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Favicon or category color */}
            <div className="relative flex-shrink-0">
              {domain ? (
                <div className="w-10 h-10 rounded-xl border border-border/50 bg-background/80 flex items-center justify-center shadow-sm">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                    loading="lazy"
                    alt=""
                    className="w-6 h-6"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <Globe className="w-5 h-5 text-muted-foreground hidden" />
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: password.categories?.color || "#6b7280",
                    backgroundImage:
                      "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  <Lock className="w-5 h-5 text-white" />
                </div>
              )}
              {isOldPassword && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-background" />
              )}
            </div>

            {/* Title and category */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-base truncate">
                  {password.title}
                </h3>
                {password.categories && (
                  <div>
                    <div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {password.categories.name}
                        <div
                          className="rounded-full w-3 h-3"
                          style={{ backgroundColor: password.categories.color }}
                        />
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Username */}
              {password.username && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate font-mono text-xs">
                    {password.username}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dropdown menu */}
          <DropdownMenu>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleShowPassword}
              disabled={isDecrypting}
              className="h-9 px-3 text-xs gap-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              {isDecrypting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </Button>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={isDecrypting}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit?.(password)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Password
              </DropdownMenuItem>

              {onDeactivate && (
                <>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDeactivate(password.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Move to Trash
                  </DropdownMenuItem>
                </>
              )}

              {onRestore && (
                <DropdownMenuItem
                  className="text-green-600 focus:text-green-600"
                  onClick={() => onRestore(password.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </DropdownMenuItem>
              )}

              {onPermanentDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onPermanentDelete(password.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete Forever
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* URL */}
        {password.url && (
          <div className="mb-4">
            <Link
              href={password.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 text-sm text-muted-foreground hover:text-primary bg-neutral-200 p-1 rounded font-mono transition-colors border-neutral-600 dark:bg-neutral-700/50 dark:border-neutral-500"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span className="truncate group-hover/link:underline border-b text-xs border-1">
                {domain || password.url}
              </span>
            </Link>
          </div>
        )}

        {/* Decrypted password display */}
        {showPassword && decryptedPassword && (
          <div className="mb-4 p-3 bg-muted/30 border border-border/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Password
              </span>
              <Shield className="w-3.5 h-3.5 text-green-500" />
            </div>
            <code className="text-sm font-mono text-foreground break-all select-all">
              {decryptedPassword}
            </code>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={handleCopyUsername}
            className="flex-1 text-xs gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy User
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyPassword}
            disabled={isDecrypting}
            className="flex-1 h-9 text-xs gap-1.5"
          >
            {isDecrypting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {isDecrypting ? "Loading..." : "Copy Pass"}
          </Button>
        </div>

        {/* Password age indicator */}
        {isOldPassword && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Password is {passwordAge} days old</span>
          </div>
        )}

        {/* Master Password Dialog */}
        <MasterPasswordDialog
          open={showMasterPasswordDialog}
          onOpenChange={setShowMasterPasswordDialog}
          onSubmit={handleDecryptWithMasterPassword}
          title="Enter Master Password"
          description="Please enter your master password to decrypt this password."
        />
      </CardContent>
    </Card>
  );
}
