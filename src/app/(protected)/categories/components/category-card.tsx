import { Category } from "@/app/types/category";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, RotateCcw, Trash2, X } from "lucide-react";

interface CategorieCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onPermanentDelete?: (categoryId: string) => void;
}

export default function CategorieCard({ 
  category,
  onEdit,
  onPermanentDelete
}: CategorieCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {category.name}
            </CardTitle>
            {category.description && (
              <CardDescription className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {category.description}
              </CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit?.(category)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {onPermanentDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onPermanentDelete(category.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete Forever
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            <span className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              Category color
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
