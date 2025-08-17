"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AddPasswordDialog } from "../../components/add-password-dialog";
import { Search, Key, Plus } from "lucide-react";
import {
  deactivatePassword,
  restorePassword,
  deletePasswordPermanently,
} from "../actions";
import PasswordCard from "./password-card";
import { Password } from "@/app/types/password";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { actionToasts } from "@/utils/toast";

interface PasswordsClientProps {
  passwords: Password[];
  isTrash: boolean;
}

export function PasswordsClient({ passwords, isTrash }: PasswordsClientProps) {

  const {
    searchTerm,
    setSearchTerm,
    filteredItems: filteredPasswords,
    hasFilteredResults,
    showEmptySearch,
    showEmptyState,
  } = useSearch({
    items: passwords,
    searchFields: ['title', 'url', 'username'] as (keyof Password)[],
  });

  const handleDeactivate = useCallback(async (passwordId: string) => {
    try {
      await deactivatePassword(passwordId);
      actionToasts.passwordMoved();
      window.location.reload();
    } catch (error) {
      actionToasts.movePasswordFailed();
      console.error("Deactivate error:", error);
    }
  }, []);

  const handleRestore = useCallback(async (passwordId: string) => {
    try {
      await restorePassword(passwordId);
      actionToasts.passwordRestored();
      window.location.reload();
    } catch (error) {
      actionToasts.restorePasswordFailed();
      console.error("Restore error:", error);
    }
  }, []);

  const handlePermanentDelete = useCallback(async (passwordId: string) => {
    try {
      await deletePasswordPermanently(passwordId);
      actionToasts.passwordDeleted();
      window.location.reload();
    } catch (error) {
      actionToasts.deletePasswordFailed();
      console.error("Permanent delete error:", error);
    }
  }, []);

  const handleEdit = useCallback((password: Password) => {
    // TODO: Implement edit functionality
    actionToasts.info("Edit functionality coming soon!");
  }, []);

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Search passwords..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
      
      {hasFilteredResults && (
        <div className="grid gap-4 cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPasswords.map((password) => (
            <PasswordCard
              key={password.id}
              password={password}
              onEdit={handleEdit}
              onDeactivate={isTrash ? undefined : handleDeactivate}
              onRestore={isTrash ? handleRestore : undefined}
              onPermanentDelete={isTrash ? handlePermanentDelete : undefined}
            />
          ))}
        </div>
      )}

      {showEmptySearch && (
        <EmptyState
          icon={Search}
          title="No passwords found"
          description="Try adjusting your search or add a new password"
          actionButton={
            !isTrash ? (
              <AddPasswordDialog>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Password
                </Button>
              </AddPasswordDialog>
            ) : undefined
          }
        />
      )}

      {showEmptyState && (
        <EmptyState
          icon={Key}
          title={isTrash ? "No deleted passwords" : "No passwords yet"}
          description={
            isTrash 
              ? "Deleted passwords will appear here" 
              : "Start securing your accounts by adding your first password"
          }
          actionButton={
            !isTrash ? (
              <AddPasswordDialog>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Password
                </Button>
              </AddPasswordDialog>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
