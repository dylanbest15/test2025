import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditStartupForm from "./edit-startup-form";

export default async function EditStartup() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile, error } = await supabase.from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    // return notFound();
  }

  if (profile.type !== "founder") {
    return redirect("/menu");
  }

  const { data: startup, error: startupErr } = await supabase.from('startups')
    .select()
    .eq('id', profile.startup_id)
    .single();

  if (startupErr) {
    console.error("Error fetching startup:", startupErr);
    // return notFound();
  }

  return (
    <div className="min-h-screen py-4">
      <div className="p-2">
        <Link href="/menu" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1" size={16} />
          Menu
        </Link>
      </div>
      <EditStartupForm startup={startup} />
    </div>
  )
}