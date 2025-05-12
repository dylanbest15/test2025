import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileSection from "./(profile-section)/profile-section";
import StartupSection from "./(startup-section)/startup-section";
import SettingsSection from "./(settings-section)/settings-section";
import FundPoolSection from "./(fund-pool-section)/fund-pool-section";

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

  let industries = [];
  if (profile.type === 'investor') {
    const { data: industryRes, error: industryErr } = await supabase.from('industries')
      .select()
      .eq('profile_id', profile.id)

    if (industryErr) {
      console.error("Error fetching industries:", industryErr);
      // return notFound();
    }
    if (industryRes) {
      industries = industryRes.map(industry => industry.name);
    }
  }

  let startup = null;
  let fundPool = null;
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

    if (startup) {
      const { data: industryRes, error: industryErr } = await supabase.from('industries')
        .select()
        .eq('startup_id', startup.id)

      if (industryErr) {
        console.error("Error fetching industries:", industryErr);
        // return notFound();
      }
      if (industryRes) {
        industries = industryRes.map(industry => industry.name);
      }

      let { data: fundPoolRes, error: fundPoolErr } = await supabase.from("fund_pools")
        .select()
        .eq("startup_id", startup.id)
        .single()
      // ignore PGRST116 error (no fund pool exists)
      if (fundPoolErr && fundPoolErr.code !== 'PGRST116') {
        console.error("Error fetching fund pool:", fundPoolErr)
        // return notFound();
      }
      if (fundPoolRes) {
        fundPool = fundPoolRes;
      }
    }

  }

  return (
    <div className="w-full mb-[100px]">
      <ProfileSection profile={profile} industries={industries} />
      {startup && profile.startup_role === "admin" && (
        <>
          <StartupSection startup={startup} industries={industries} />
          {fundPool && (
            <FundPoolSection fundPool={fundPool} />
          )}
        </>
      )}
      <SettingsSection />
      <div className="flex flex-col items-center space-y-1 text-xs text-sidebar-foreground/70">
        <div className="font-semibold">© 2025 The Fund Pool, Inc.</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  )
}