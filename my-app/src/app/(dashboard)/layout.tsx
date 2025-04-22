import { AppNavbar } from "@/components/custom/app-navbar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const { data: profile, error } = await supabase.from('profiles').select().eq('id', user.id).single();
  if (error) {
    console.error("Error fetching profile:", error);
    // return notFound();
  }
  const { data: member, error: memberError } = await supabase.from('members').select().eq('profile_id', user.id).single();
  if (memberError) {
    console.error("Error fetching member:", memberError);
  }
  let profileMember;
  let memberStartup;
  if (member.startup_id) {
    const { data: startup, error: startupError } = await supabase.from('startups').select().eq('id', member.startup_id).single();
    if (startupError) {
      console.error("Error fetching startup:", startupError)
    } else {
      profileMember = member;
      memberStartup = startup;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar profile={profile} member={member} startup={memberStartup}/>
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar />
          {children}
          {/* <StartupDashboard startup={startup}></StartupDashboard> */}
        </SidebarProvider>
      </div>
    </div>
  )
}