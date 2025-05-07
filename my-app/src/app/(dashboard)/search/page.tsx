import StartupSearch from "@/app/(dashboard)/search/(startups)/startup-search";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InvestorSearch from "@/app/(dashboard)/search/(investors)/investor-search";

export default async function Search() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  if (user.user_metadata.type === 'investor') {
    return (
      <StartupSearch />
    )
  } else if (user.user_metadata.type === 'founder') {
    return (
      <InvestorSearch />
    )
  }
}