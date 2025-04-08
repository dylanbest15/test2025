import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchCard } from "@/custom/ui/search-card";
import SearchDemo from "@/custom/ui/search-demo";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockStartups, Startup } from "@/types/startup";
import { ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen h-screen overflow-hidden relative">
      <SearchDemo />
      {/* Fund Pool info - always visible */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center flex-shrink-0">
        <div className="max-w-md">
          <h1 className="mb-2 text-4xl font-medium text-gray-900">The Fund Pool</h1>
          <p className="mb-8 text-gray-600">The new hub for startups and investors.</p>

          <div className="mb-8 h-px w-full bg-gray-200" />

          <p className="mb-6 text-gray-700">
            Join as a startup and connect with investors. Join as an investor and connect with startups.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>

  );
}
