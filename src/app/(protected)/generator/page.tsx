import { create } from "domain";
import PasswordGeneratorCard from "./components/password-generator-card";
import TipsGeneratorCard from "./components/tips-generator-card";
import { createClient } from "../../../../utils/server";

export default async function GeneratePasswordPage() {
  const supabase = await createClient();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate Password</h1>
        <p className="text-muted-foreground">
          Create secure and customized passwords to protect your accounts
        </p>
      </div>
      <PasswordGeneratorCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TipsGeneratorCard />
      </div>
    </div>
  );
}
