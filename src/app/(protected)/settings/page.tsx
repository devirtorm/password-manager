import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar } from "lucide-react";
import { createClient } from "../../../../utils/server";

export default async function AccountSettings() {
  const supabase = await createClient();
    const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userDetails, error } = await supabase
    .from("user_profiles")
    .select("id, first_name, last_name")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    console.error("Error fetching user details:", error);
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="max-w-3xl w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue={userDetails?.first_name || ""}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue={userDetails?.last_name || ""}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address
              </p>
            </div>

            <Button className="w-full md:w-auto">
              Update Account Information
            </Button>
          </CardContent>
        </Card>
        <Card className="max-w-3xl w-full mt-6 border border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deleteAccount">Delete Account</Label>
                <div className="space-y-4">
                  <Input
                    autoComplete="off"
                    id="deleteAccount"
                    placeholder=""
                    aria-placeholder="Type your master password to confirm"
                    type="password"
                  />
                  <Button variant="destructive" className="w-full md:w-auto">
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
