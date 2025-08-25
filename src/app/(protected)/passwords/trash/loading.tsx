import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Key } from "lucide-react";

export default function PasswordsTrashLoading() {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Deleted Password</h1>
          <p className="text-muted-foreground">
            Look at your deleted passwords here
          </p>
        </div>
      </div>

      {/* Badge section */}
      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <Key className="h-3 w-3" />
          <Skeleton className="h-4 w-8 inline-block" />
          deleted passwords
        </Badge>
      </div>

      {/* Content section */}
      <div className="space-y-6">
        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-full max-w-sm" />
        
        {/* Password cards grid skeleton - fewer items for trash */}
        <div className="grid gap-4 cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
                <Skeleton className="h-3 w-24" />
              </div>
              
              {/* Card actions - restore and permanent delete buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Info message skeleton */}
        <div className="text-center py-8 space-y-2">
          <Skeleton className="h-4 w-80 mx-auto" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </div>
      </div>
    </div>
  );
}
