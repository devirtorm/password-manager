import { createClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";
import SignupPageClient from "./components/signup-page-client";

export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    console.log("User is already logged in, redirecting to dashboard");
    redirect("/dashboard");
  } else {
    return <SignupPageClient />;
  }
}
