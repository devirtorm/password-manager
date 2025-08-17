import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoPermissions() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-800 mb-4">403</h1>
        <p className="text-xl text-slate-600 mb-6">Access Denied</p>
        <p className="text-slate-500 mb-8">
          You do not have permission to view this page.
        </p>
        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}