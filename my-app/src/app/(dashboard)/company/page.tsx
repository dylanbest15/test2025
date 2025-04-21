import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CompanyCreate from "@/app/(dashboard)/company/company-create";
import CompanyView from "@/app/(dashboard)/company/company-view";

export default async function Company() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: member, error: memberError } = await supabase.from('members').select().eq('profile_id', user.id).single();
  if (memberError) {
    console.error("Error fetching member:", memberError);
  }
  if (!member) {
    return (
      <CompanyCreate user={user} />
    )
  }

  if (member.startup_id) {
    const { data: startup, error: startupError } = await supabase.from('startups').select().eq('id', member.startup_id).single();
    if (startupError) {
      console.error("Error fetching startup:", startupError)
    }
    if (startup) {
      return (
        <CompanyView member={member} startup={startup} />
      )
    }
  }
  
  return (
    <div>We found your company, but couldn't load the details.</div>
  )
}