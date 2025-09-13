import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FolderArchive, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoriesHeader from "./components/categories-header";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <CategoriesHeader />

      {/* Badge section */}
      <div className="flex gap-2">
        <Badge variant="outline" className="gap-1">
          <FolderArchive className="h-3 w-3" />
          <Skeleton className="h-4 w-8 inline-block" />
          categories
        </Badge>
      </div>

      {/* Content section */}
      <div className="space-y-6">
        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-full max-w-sm" />

        {/* Category cards grid skeleton */}
        <div className="grid gap-4 cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="group overflow-hidden relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
