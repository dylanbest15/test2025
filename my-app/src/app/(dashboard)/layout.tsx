import { NavbarDesktop } from "@/components/app-shell/navbar-desktop";
import { NavbarMobile } from "@/components/app-shell/navbar-mobile";
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
      {/* Mobile Navbar - Hidden on desktop */}
      <div className="lg:hidden">
        <NavbarMobile type={user.user_metadata.type} />
      </div>
      {/* Desktop Navbar - Hidden on mobile */}
      <div className="hidden lg:block">
        <NavbarDesktop />
      </div>
      <div className="flex flex-1">
        {/* <SidebarProvider> */}
          {/* <AppSidebar /> */}
          {children}
          {/* <StartupDashboard startup={startup}></StartupDashboard> */}
        {/* </SidebarProvider> */}
      </div>
    </div>
  )
}