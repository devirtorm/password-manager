import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "../../../../../utils/server";

export default async function RecentPassword() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get recent passwords for current user only
  const { data } = await supabase
    .from("passwords")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Passwords</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {data?.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent passwords.</p>
        )}

        {data?.map((password: any) => (
          <div
            key={password.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {(() => {
                const colors = [
                  "bg-red-100 text-red-600",
                  "bg-green-100 text-green-600",
                  "bg-blue-100 text-blue-600",
                  "bg-yellow-100 text-yellow-600",
                  "bg-purple-100 text-purple-600",
                  "bg-pink-100 text-pink-600",
                  "bg-indigo-100 text-indigo-600",
                  "bg-teal-100 text-teal-600",
                ];
                const idx =
                  typeof password.id === "string"
                    ? password.id
                        .split("")
                        .reduce(
                          (acc: number, char: string) =>
                            acc + char.charCodeAt(0),
                          0
                        ) % colors.length
                    : 0;
                const colorClass = colors[idx];
                return (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}
                  >
                    <span className="font-bold">
                      {password.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                );
              })()}
              <div>
                <p className="font-medium">{password.title}</p>
                <p className="text-sm text-muted-foreground">
                  {password.username}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
