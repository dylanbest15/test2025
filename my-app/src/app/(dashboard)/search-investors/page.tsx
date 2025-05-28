import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InvestorSearch from "@/app/(dashboard)/search-investors/investor-search";

export default async function SearchInvestors() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  return (
    <div className="w-full bg-[#f8f9fa]">
      <InvestorSearch />
    </div>
  )
}