import HeaderAuth from "@/components/auth/header-auth";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import ProfileView from "./profile-view";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // const { data: profiles, error } = await supabase.from('profiles').select();
  const { data: profile, error } = await supabase.from('profiles').select().eq('id', user.id).single()
  // console.log('profiles', profiles, error)
  console.log('profile', profile, error);

  return (
    <div className="flex-1 w-full flex flex-col gap-6 md:gap-12 p-6 items-center">
      <ProfileView profile={profile} />
    </div>

    // <div className="flex-1 w-full flex flex-col gap-6 md:gap-12 items-center">
    //   {/* Full-width header */}
    //   <div className="w-full bg-accent">
    //     <div className="max-w-2xl mx-auto w-full text-xs md:text-sm p-2 md:p-3 px-4 md:px-6 text-foreground flex gap-2 md:gap-3 items-center">
    //       <InfoIcon size="16" strokeWidth={2} />
    //       <span>This is a protected page that you can only see as an authenticated user</span>
    //     </div>
    //   </div>

    //   {/* Centered content with limited width */}
    //   <div className="max-w-2xl w-full px-4 md:px-6 flex flex-col gap-6 md:gap-12">
    //     <div className="flex flex-col gap-2 items-start w-full">
    //       <h2 className="font-bold text-xl md:text-2xl mb-2 md:mb-4">Your user details</h2>
    //       <pre className="text-xs font-mono p-2 md:p-3 rounded border w-full overflow-x-auto max-h-32 overflow-y-auto">
    //         {JSON.stringify(user, null, 2)}
    //       </pre>
    //     </div>

    //     <div className="w-full flex justify-center">
    //       <HeaderAuth />
    //     </div>
    //   </div>
    // </div>
  );
}
