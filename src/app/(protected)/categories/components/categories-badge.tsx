import { Badge } from "@/components/ui/badge";
import { FolderArchive } from "lucide-react";
import React from "react";
import { getCategories } from "../actions";

export default async function CategoriesBadge({count}: {count?: number}) {
  return (
    <Badge variant="outline" className="gap-1">
      <FolderArchive className="h-3 w-3" />
      {count || 0} categories
    </Badge>
  );
}
