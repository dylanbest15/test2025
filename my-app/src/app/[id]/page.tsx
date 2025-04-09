import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { AppTopbar } from "@/components/custom/app-topbar";
import StartupDashboard from "@/components/custom/startup-dashboard";
import { mockStartups } from "@/types/startup";
import { notFound } from "next/navigation";

interface DashboardProps {
  params: {
    id: string
  }
}

export default async function Dashboard({ params }: DashboardProps) {
  const { id } = await params;
  const startupId = Number.parseInt(id)
  const startup = mockStartups.find((s) => s.id === startupId)

  // If no startup is found, return a 404 page
  if (!startup) {
    notFound()
  }

  return (
    // <div className="flex flex-col min-h-screen">
      // <AppTopbar notificationCount={3} />
      // <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar className="pt-16" startup={startup} />
          <StartupDashboard startup={startup}></StartupDashboard>
        </SidebarProvider>
      // </div>
    // </div>
  )
}