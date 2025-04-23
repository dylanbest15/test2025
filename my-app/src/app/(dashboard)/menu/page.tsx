import MenuView from "@/app/(dashboard)/menu/menu-view";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Menu() {
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
    <MenuView profile={profile} startup={startup} />
  )
}