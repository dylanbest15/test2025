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

  // Get the profile
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    // return notFound();
  }

  // Get the startup if startup_id exists
  let startup = null
  if (profile.startup_id) {
    const { data: startupData } = await supabase.from("startups").select("*").eq("id", profile.startup_id).single()

    startup = startupData
  }

  // Calculate 7 days ago for the seen notifications filter
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoISO = sevenDaysAgo.toISOString()

  // Build the base query with seen conditions
  let notificationsQuery = supabase
    .from("notifications")
    .select("*")
    .or(`seen.eq.false,and(seen.eq.true,created_at.gte.${sevenDaysAgoISO})`)

  if (startup) {
    // If startup exists, get notifications for both profile and startup
    notificationsQuery = notificationsQuery.or(`recipient_id.eq.${profile.id},recipient_id.eq.${startup.id}`)
  } else {
    // If no startup, only get notifications for the profile
    notificationsQuery = notificationsQuery.eq("recipient_id", profile.id)
  }

  const { data: notifications } = await notificationsQuery.order("created_at", { ascending: false })

  let notificationCount = 0;
  if (notifications) {
    notificationCount = notifications.filter(notification => notification.seen === false).length;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Navbar - Hidden on desktop */}
      <div className="lg:hidden">
        <NavbarMobile type={user.user_metadata.type} notificationCount={notificationCount} />
      </div>
      {/* Desktop Navbar - Hidden on mobile */}
      <div className="hidden lg:block">
        <NavbarDesktop />
      </div>
      <div className="flex flex-1">
        {/* <SidebarProvider> */}
        {/* <AppSidebar /> */}
        {children}
        {/* </SidebarProvider> */}
      </div>
    </div>
  )
}