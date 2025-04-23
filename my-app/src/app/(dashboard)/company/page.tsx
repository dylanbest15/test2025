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

  const { data: profile, error } = await supabase.from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    // return notFound();
  }

  if (!profile.startup_id) {
    return (
      <CompanyCreate profile={profile} />
    )
  }

  if (profile.startup_id) {
    const { data: startup, error: startupError } = await supabase.from('startups')
      .select()
      .eq('id', profile.startup_id)
      .single();

    if (startupError) {
      console.error("Error fetching startup:", startupError);
      // return notFound();
    }
    if (startup) {
      return (
        <CompanyView startup={startup} />
      )
    }
  }
}