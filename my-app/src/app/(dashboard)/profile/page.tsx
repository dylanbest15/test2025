import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ProfileView from "./profile-view";
import HeaderAuth from "@/components/auth/header-auth";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile, error } = await supabase.from('profiles').select().eq('id', user.id).single();

  if (error) {
    console.error("Error fetching profile:", error);
    return notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 md:gap-12 p-6 items-center">
      <ProfileView profile={profile} />
      <HeaderAuth />
    </div>
  );
}
