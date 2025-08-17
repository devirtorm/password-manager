import { Button } from "@/components/ui/button";
import { ShieldQuestionMark } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
        <div className="flex justify-center items-center mb-4">
            <span className="text-xl text-slate-600">Page Not Found</span>
            <ShieldQuestionMark className="h-6 w-6 text-slate-500 mr-2"/>
        </div>
        <p className="text-slate-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}