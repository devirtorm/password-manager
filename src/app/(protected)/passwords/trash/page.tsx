import { Button } from "@/components/ui/button";
import { AddPasswordDialog } from "../../components/add-password-dialog";
import { Key, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PasswordsClient } from "../components/password-client";
import { createClient } from "../../../../../utils/server";

export default async function PasswordTrashPage() {
  const supabase = await createClient();

  const { data: passwords, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("active", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching passwords:", error);
    return <div>Error fetching passwords</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Deleted Password</h1>
          <p className="text-muted-foreground">
            Look at your deleted passwords here
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <Key className="h-3 w-3" />
          {passwords?.length || 0} passwords
        </Badge>
      </div>
      <PasswordsClient passwords={passwords || []} isTrash={true} />
    </div>
  );
}
