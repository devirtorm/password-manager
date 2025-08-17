import { createClient } from "../../../utils/server";
import NoPermissions from "./components/no-permissions";
import { ProtectedLayout } from "./components/protected-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <NoPermissions />;
  }

  const { data: userDetails, error } = await supabase
    .from("user_profiles")
    .select("id, first_name, last_name")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    console.error("Error fetching user details:", error);
  }

  return (
    <ProtectedLayout user={user} userDetails={userDetails}>
      {children}
    </ProtectedLayout>
  );
}
