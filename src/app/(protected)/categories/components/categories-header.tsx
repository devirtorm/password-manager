import React from "react";
import { AddCategoryDialog } from "./add-category-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CategoriesHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          View and organize your password categories
        </p>
      </div>
      <AddCategoryDialog>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </AddCategoryDialog>
    </div>
  );
}
