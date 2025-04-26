import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileSection from "./(profile-section)/profile-section";
import StartupSection from "./(startup-section)/startup-section";
import SettingsSection from "./(settings-section)/settings-section";

export default async function Menu() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data: profile, error } = await supabase.from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    // return notFound();
  }

  let startup = null;
  if (profile.startup_id) {
    const { data: startupRes, error: startupErr } = await supabase.from('startups')
      .select()
      .eq('id', profile.startup_id)
      .single();

    if (startupErr) {
      console.error("Error fetching startup:", startupErr);
      // return notFound();
    }
    if (startupRes) {
      startup = startupRes;
    }
  }

  return (
    <div className="w-full mb-[100px]">
      <ProfileSection profile={profile} />
      {startup && profile.startup_role === "admin" && (
        <StartupSection startup={startup} />
      )}
      <SettingsSection />
      <div className="flex flex-col items-center space-y-1 text-xs text-sidebar-foreground/70">
        <div className="font-semibold">© 2025 The Fund Pool, Inc.</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  )
}