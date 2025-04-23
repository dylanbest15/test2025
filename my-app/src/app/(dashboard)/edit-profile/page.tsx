import { createClient } from "@/utils/supabase/server";
import EditProfileForm from "./edit-profile-form";
import { redirect } from "next/navigation";

export default async function EditProfile() {
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
    // return notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <EditProfileForm profile={profile} />
    </div>
  )
}