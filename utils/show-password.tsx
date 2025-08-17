import { Eye, EyeOff } from "lucide-react";

export function getPasswordIcon(showPassword: boolean) {
  if (showPassword) {
    return (
        <>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Hide password</span>
        </>
    );
  }
  return (
      <>
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Show password</span>
      </>
  );
}

export function changeTypeInput(showPassword: boolean) {
  return showPassword ? "text" : "password";
}
