import { Card } from "@/components/ui/card";
import { AlertTriangle, Archive, Clock10, Key} from "lucide-react";

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Passwords
            </p>
            <p className="text-2xl font-bold">24</p>
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
            <p className="text-2xl font-bold text-red-600">3</p>
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
            <p className="text-2xl font-bold">8</p>
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
            <p className="text-2xl font-bold">5</p>
          </div>
          <Clock10 className="h-6 w-6 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
}
