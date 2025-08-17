import { Button } from "@/components/ui/button";
import { createClient } from "../../../../utils/server";
import { AddPasswordDialog } from "../components/add-password-dialog";
import { FolderArchive, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClientCategories } from "./components/client-categories";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            View and organize your password categories
          </p>
        </div>
        <AddPasswordDialog>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </AddPasswordDialog>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <FolderArchive className="h-3 w-3" />
          {categories?.length || 0} categories
        </Badge>
      </div>
      <ClientCategories categories={categories || []} isTrash={false} />
    </div>
  );
}
