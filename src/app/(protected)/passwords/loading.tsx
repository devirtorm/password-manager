import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Key, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PasswordsLoading() {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Passwords</h1>
          <p className="text-muted-foreground">
            Manage your saved passwords securely
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4" />
          Add Password
        </Button>
      </div>

      {/* Badge section */}
      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <Key className="h-3 w-3" />
          <Skeleton className="h-4 w-8 inline-block" />
          passwords
        </Badge>
      </div>

      {/* Content section */}
      <div className="space-y-6">
        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-full max-w-sm" />
        
        {/* Password cards grid skeleton */}
        <div className="grid gap-4 cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              
              {/* Card content */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              
              {/* Card actions */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
