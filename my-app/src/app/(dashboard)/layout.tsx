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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar type={user.user_metadata.type} />
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