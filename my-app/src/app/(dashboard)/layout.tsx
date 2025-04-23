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

  let member = null;
  let memberStartup = null;

  if (profile?.type === "founder") {
    const { data: memberData, error: memberError } = await supabase.from('members').select().eq('profile_id', user.id).single();

    if (!memberError && memberData) {
      member = memberData;
      if (member.startup_id) {
        const { data: startup, error: startupError } = await supabase.from('startups').select().eq('id', member.startup_id).single();
        if (!startupError && startup) {
          memberStartup = startup;
        } else if (startupError) {
          console.error("Error fetching startup:", startupError);
        }
      }
    } else if (memberError && memberError.code !== 'PGRST116') {
      // PGRST116 is the "no rows returned" error code
      console.error("Error fetching member:", memberError);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar profile={profile} member={member} startup={memberStartup} />
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