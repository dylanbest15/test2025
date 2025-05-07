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
        <ViewStartupResult startup={startup} fundPool={fundPool} />
      )
    }
  }
}