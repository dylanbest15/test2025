import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/custom/ui/app-sidebar";
import { AppTopbar } from "@/custom/ui/app-topbar";
import PitchDeck from "@/custom/ui/pitch-deck";
import ProgressCard from "@/custom/ui/progress-card";
import { mockStartups } from "@/types/startup";
import { TabsList } from "@radix-ui/react-tabs";
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
    <div className="flex flex-col min-h-screen">
      <AppTopbar notificationCount={3} />
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar className="pt-16" startup={startup} />
          <main className="flex-1 w-full mx-auto p-8 flex flex-col items-center">
            <Tabs defaultValue="fund-pool" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2 rounded bg-gray-100 mb-2">
                <TabsTrigger value="fund-pool">Fund Pool</TabsTrigger>
                <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
              </TabsList>
              <TabsContent value="fund-pool">
                <ProgressCard startup={startup}></ProgressCard>
              </TabsContent>
              <TabsContent value="pitch-deck">
                <PitchDeck startup={startup}></PitchDeck>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarProvider>
      </div>
    </div>
  )
}