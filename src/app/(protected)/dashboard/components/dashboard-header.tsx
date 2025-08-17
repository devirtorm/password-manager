import { Button } from "@/components/ui/button";
import { AddPasswordDialog } from "../../components/add-password-dialog";
import { PlusCircle } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your activity.
        </p>
      </div>
      <AddPasswordDialog>
        <Button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Password
        </Button>
      </AddPasswordDialog>
    </div>
  );
}
