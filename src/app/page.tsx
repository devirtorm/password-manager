import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Smartphone, Key, Lock} from "lucide-react";
import { createClient } from "../../utils/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-slate-300">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                SignSafe
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-800" asChild>
                <Link href="/login" >Log In</Link>
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-800">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-sm font-medium mb-8">
              <Lock className="w-4 h-4 mr-2" />
              Secure & Simple
            </div>
            
            <h1 className="text-6xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block mb-4">Your Passwords</span>
              <span className="text-white bg-slate-700 rounded-2xl mt-3 px-4">Simplified</span>
            </h1> 
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A modern, secure password manager built with Next.js and TypeScript. 
              Store, generate, and manage all your passwords in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white text-lg px-8 py-6 border border-slate-800 shadow-lg" asChild>
                <Link href="/login">Try Demo</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                <Link href="https://github.com/yourusername/password-manager" target="_blank">
                  View on GitHub
                </Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 mx-auto border border-slate-200">
                  <Shield className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Secure Storage</h3>
                <p className="text-slate-600">Your passwords are encrypted and stored securely using modern encryption standards.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 mx-auto border border-slate-200">
                  <Key className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Password Generator</h3>
                <p className="text-slate-600">Generate strong, unique passwords with customizable length and character sets.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 mx-auto border border-slate-200">
                  <Smartphone className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Modern Interface</h3>
                <p className="text-slate-600">Clean, responsive design built with Next.js, TypeScript, and Tailwind CSS.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>
    </div>
  );
}
