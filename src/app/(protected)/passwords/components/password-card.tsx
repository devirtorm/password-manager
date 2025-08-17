import { Password } from "@/app/types/password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Badge, Copy, Edit, Eye, EyeOff, Files, Globe, Link2, Loader2, MoreHorizontal, Trash2, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MasterPasswordDialog } from "../../components/master-password-dialog";
import { decryptUserPassword } from "../actions";

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
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showMasterPasswordDialog, setShowMasterPasswordDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'show' | 'copy' | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error(`Failed to copy ${type.toLowerCase()}`);
    }
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
      
      if (pendingAction === 'show') {
        setShowPassword(true);
      } else if (pendingAction === 'copy') {
        await copyToClipboard(decrypted, "Password");
      }
    } catch (error) {
      toast.error("Failed to decrypt password. Please check your master password.");
      throw error;
    } finally {
      setIsDecrypting(false);
      setPendingAction(null);
    }
  };

  const handleShowPassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }

    if (decryptedPassword) {
      setShowPassword(true);
      return;
    }

    setPendingAction('show');
    setShowMasterPasswordDialog(true);
  };

  const handleCopyPassword = async () => {
    if (decryptedPassword) {
      await copyToClipboard(decryptedPassword, "Password");
      return;
    }

    setPendingAction('copy');
    setShowMasterPasswordDialog(true);
  };

  return (
    <Card className="h-full shadow-sm border border-gray-200">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 border-2 bg-neutral-100 rounded-lg flex items-center justify-center shadow-sm">
            <Globe className="h-5 w-5 text-gray-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {password.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {password.username && (
                <span className="truncate text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 border border-gray-300">
                  {password.username}
                </span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                disabled={isDecrypting}
              >
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(password)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              
              {onDeactivate && (
                <>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const decryptedPass = decryptedPassword;
                        if (decryptedPass) {
                          copyToClipboard(
                            JSON.stringify(
                              {
                                title: password.title,
                                url: password.url,
                                username: password.username,
                                password: decryptedPass,
                              },
                              null,
                              2
                            ),
                            "Password data"
                          );
                        } else {
                          toast.error("Please decrypt the password first");
                        }
                      } catch (error) {
                        toast.error("Failed to export password data");
                      }
                    }}
                  >
                    <Files className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDeactivate(password.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Move to Trash
                  </DropdownMenuItem>
                </>
              )}

              {onRestore && (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => onRestore(password.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </DropdownMenuItem>
              )}
              
              {onPermanentDelete && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onPermanentDelete(password.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete Forever
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3"
            onClick={() => copyToClipboard(password.username || "", "Username")}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy User
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3"
            onClick={handleCopyPassword}
            disabled={isDecrypting}
          >
            {isDecrypting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            Copy Pass
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 text-xs px-3"
            onClick={handleShowPassword}
            disabled={isDecrypting}
          >
            {isDecrypting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : showPassword ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {isDecrypting ? "Loading..." : showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <div className="text-xs text-gray-500 truncate border border-gray-200 rounded px-2 py-1">
          <Link
            href={password.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center"
          >
            {password.url ? (
              <>
                <Link2 className="inline-block h-4 w-4 mr-1 text-gray-400" />
                {password.url}
              </>
            ) : (
              "No URL provided"
            )}
          </Link>
        </div>

        {showPassword && decryptedPassword && (
          <div className="mt-2 p-3 bg-gray-50 border border-teal-200 rounded text-sm font-mono text-teal-800 shadow-inner">
            {decryptedPassword}
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
