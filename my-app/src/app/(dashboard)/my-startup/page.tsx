import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyStartupView from "@/app/(dashboard)/my-startup/my-startup-view";
import MyStartupCreate from "@/app/(dashboard)/my-startup/my-startup-create";

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
      <MyStartupCreate profile={profile} />
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
        <MyStartupView startup={startup} />
      )
    }
  }
}