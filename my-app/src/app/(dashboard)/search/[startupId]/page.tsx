import { createClient } from "@/utils/supabase/server";
import ViewStartupResult from "./view-startup-result";

interface StartupResultProps {
  params: Promise<{ startupId: string }>
}

export default async function StartupResult({ params }: StartupResultProps) {
  const supabase = await createClient()

  const resolvedParams = await params;
  const startupId = resolvedParams.startupId;

  // If the startup id parameter exists, fetch and render it
  if (startupId) {
    const { data: startup, error: error } = await supabase
      .from("startups")
      .select()
      .eq("id", startupId)
      .single()

    if (error) {
      console.error("Error fetching startup:", error)
      // return notFound();
    }

    let industries = [];
    // Fetch startup industries
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
    
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    let favorite = null;
    // Fetch favorite data
    if (user) {
      // Check if the startup exists in the user's favorites
      const { data: favoriteRes, error: favoriteErr } = await supabase
        .from("favorites")
        .select("id")
        .eq("startup_id", startupId)
        .eq("profile_id", user.id)
        .maybeSingle();
      
      if (favoriteErr) {
        console.error("Error checking if startup is favorited:", favoriteErr);
      }
      if (favoriteRes) {
        favorite = favoriteRes;
      }
    }

    // Fetch the fund pool
    let { data: fundPool, error: fundPoolErr } = await supabase
    .from("fund_pools")
    .select()
    .eq("startup_id", startupId)
    .single()

    // ignore PGRST116 error (no fund pool exists)
    if (fundPoolErr && fundPoolErr.code !== 'PGRST116') {
      console.error("Error fetching fund pool:", fundPoolErr)
      // return notFound();
    }

    if (startup) {
      return (
        <ViewStartupResult startup={startup} industries={industries} favorite={favorite} fundPool={fundPool} />
      )
    }
  }
}