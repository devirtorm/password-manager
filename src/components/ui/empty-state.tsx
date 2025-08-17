import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionButton?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionButton, 
  className = "" 
}: EmptyStateProps) {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <CardContent>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription className="mb-4">
          {description}
        </CardDescription>
        {actionButton}
      </CardContent>
    </Card>
  );
}
