import { Button } from "@/components/ui/button";
import { createClient } from "../../../../utils/server";
import { AddPasswordDialog } from "../components/add-password-dialog";
import { FolderArchive, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClientCategories } from "./components/client-categories";
import { AddCategoryDialog } from "./components/add-category-dialog";
import { getCategories } from "./actions";
import CategoriesBadge from "./components/categories-badge";
import CategoriesHeader from "./components/categories-header";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <CategoriesHeader />
      <div className="flex gap-2">
        <CategoriesBadge count={categories?.length} />
      </div>
      <ClientCategories categories={categories || []} isTrash={false} />
    </div>
  );
}
