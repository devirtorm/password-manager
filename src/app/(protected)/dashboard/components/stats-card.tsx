"use server"
import { Card } from "@/components/ui/card";
import { AlertTriangle, Archive, Clock10, Key} from "lucide-react";
import { createClient } from "../../../../../utils/supabase/server";

export default async function StatsCards() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Get passwords for current user only
  const { data } = await supabase
    .from("passwords")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true); // Only count active passwords

  // Get categories count for current user
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id);

  // Calculate recently added (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentPasswords = data?.filter((password: any) => 
    new Date(password.created_at) >= sevenDaysAgo
  ) || [];

  const totalPasswords = data?.length || 0;
  const totalCategories = categories?.length || 0;
  const recentlyAdded = recentPasswords.length;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Passwords
            </p>
            <p className="text-2xl font-bold">{totalPasswords}</p>
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
            <p className="text-2xl font-bold">{totalCategories}</p>
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
            <p className="text-2xl font-bold">{recentlyAdded}</p>
          </div>
          <Clock10 className="h-6 w-6 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
}
