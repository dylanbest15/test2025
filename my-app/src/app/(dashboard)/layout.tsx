import { AppNavbar } from "@/components/custom/app-navbar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
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