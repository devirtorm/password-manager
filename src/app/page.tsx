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
    <div className="min-h-screen">
      <nav className="backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600">
                SignSafe
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800" asChild>
                <Link href="/login" >Log In</Link>
              </Button>
              <Button className="bg-indigo-800 hover:bg-indigo-700 text-white border border-indigo-800">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500 shadow-indigo-400 shadow-2xl text-indigo-50 border border-indigo-300 text-sm font-medium mb-8">
              <Lock className="w-4 h-4 mr-2" />
              Secure & Simple
            </div>
            
            <h1 className="text-6xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="block mb-4">Your Passwords</span>
              <span className="text-indigo-600 rounded-2xl mt-3 px-4">Simplified</span>
            </h1> 

            <p className="text-xl text-gray-700 font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
              A modern, secure password manager built with Next.js and TypeScript. 
              Store, generate, and manage all your passwords in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 border border-indigo-800 shadow-lg" asChild>
                <Link href="/login">Try Demo</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-indigo-300 text-indigo-700 hover:bg-indigo-100" asChild>
                <Link href="https://github.com/devirtorm/password-manager" target="_blank">
                  View on GitHub
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-indigo-600 backdrop-blur-sm rounded-2xl p-8 border border-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto border border-white/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Secure Storage</h3>
                <p className="text-white">Your passwords are encrypted and stored securely using modern encryption standards.</p>
              </div>
              
              <div className="bg-indigo-600 backdrop-blur-sm rounded-2xl p-8 border border-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto border border-white/30">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Password Generator</h3>
                <p className="text-white">Generate strong, unique passwords with customizable length and character sets.</p>
              </div>
              
              <div className="bg-indigo-600 backdrop-blur-sm rounded-2xl p-8 border border-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto border border-white/30">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Modern Interface</h3>
                <p className="text-white">Clean, responsive design built with Next.js, TypeScript, and Tailwind CSS.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>
    </div>
  );
}
