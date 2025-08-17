"use client";
import { Category } from "@/app/types/category";
import { useCallback, useMemo, useState } from "react";
import { deactivateCategory, deleteCategoryPermanently } from "../actions";
import { toast } from "sonner";
import { SearchBar } from "@/components/ui/search-bar";
import { useSearch } from "@/hooks/useSearch";
import { EmptyState } from "@/components/ui/empty-state";
import { FolderArchive, Search } from "lucide-react";
import CategorieCard from "./categorie-card";
import { actionToasts, showToast } from "@/utils/toast";

interface ClientCategoriesProps {
  categories: Category[];
  isTrash: boolean;
}
export function ClientCategories({
  categories,
  isTrash,
}: ClientCategoriesProps) {
  const {
    searchTerm,
    setSearchTerm,
    filteredItems: filteredCategories,
    hasFilteredResults,
    showEmptySearch,
    showEmptyState,
  } = useSearch({
    items: categories,
    searchFields: ["name", "description"] as (keyof Category)[],
  });

  const handleDeactivate = useCallback(async (categoryId: string) => {
    try {
      await deactivateCategory(categoryId);
      showToast.success("Category deactivated successfully");
      window.location.reload();
    } catch (error) {
      showToast.error("Failed to deactivate category");
      console.error("Deactivate error:", error);
    }
  }, []);

  const handlePermanentDelete = async (categoryId: string) => {
    try {
      await deleteCategoryPermanently(categoryId);
      toast.success("Category permanently deleted", {
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          border: "none",
          color: "white",
        },
      });
    } catch (error) {
      toast.error("Failed to delete category permanently");
      throw error;
    }
  };

  const handleEdit = useCallback((category: Category) => {
    // TODO: Implement edit functionality
    actionToasts.info("Edit functionality coming soon!");
  }, []);

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Search categories..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {hasFilteredResults && (
        <div className="grid gap-4 cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategorieCard
              key={category.id}
              category={category}
              onDeactivate={handleDeactivate}
              onPermanentDelete={handlePermanentDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showEmptySearch && (
        <EmptyState
          icon={Search}
          title="No passwords found"
          description="Try adjusting your search or add a new password"
        />
      )}

      {showEmptyState && (
        <EmptyState
          icon={FolderArchive}
          title={isTrash ? "No deleted passwords" : "No passwords yet"}
          description={
            isTrash
              ? "Deleted passwords will appear here"
              : "Start securing your accounts by adding your first password"
          }
        />
      )}
    </div>
  );
}
