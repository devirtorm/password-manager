import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Key, AlertTriangle, Archive, Clock10 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Dashboard Header skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats cards skeleton - matching the real structure */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Passwords
              </p>
              <Skeleton className="h-8 w-8 mt-1" />
            </div>
            <Key className="h-6 w-6 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Weak Passwords
              </p>
              <Skeleton className="h-8 w-8 mt-1" />
            </div>
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Categories
              </p>
              <Skeleton className="h-8 w-8 mt-1" />
            </div>
            <Archive className="h-6 w-6 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Recently Added
              </p>
              <Skeleton className="h-8 w-8 mt-1" />
            </div>
            <Clock10 className="h-6 w-6 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Content grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Overview skeleton */}
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Passwords skeleton */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
