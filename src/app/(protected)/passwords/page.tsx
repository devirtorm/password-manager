import { Button } from "@/components/ui/button";
import { createClient } from "../../../../utils/server";
import { AddPasswordDialog } from "../components/add-password-dialog";
import { Key, Plus } from "lucide-react";
import { PasswordsClient } from "./components/password-client";
import { Badge } from "@/components/ui/badge";

export default async function PasswordsPage() {
  const supabase = await createClient();

  const { data: passwords, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching passwords:", error);
    return <div>Error fetching passwords</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Passwords</h1>
          <p className="text-muted-foreground">
            Manage your saved passwords securely
          </p>
        </div>
        <AddPasswordDialog>
          <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white">
            <Plus className="h-4 w-4" />
            Add Password
          </Button>
        </AddPasswordDialog>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <Key className="h-3 w-3" />
          {passwords?.length || 0} passwords
        </Badge>
      </div>
      <PasswordsClient passwords={passwords || []} isTrash={false} />
    </div>
  );
}
