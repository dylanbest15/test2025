'use client';

import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import ProgressCard from "@/components/custom/progress-card";
import PitchDeck from "@/components/custom/pitch-deck";
import { useIsMobile } from "@/hooks/use-mobile";
import { Startup } from "@/types/startup";

interface StartupDashboardProps {
  startup: Startup;
}

export default function StartupDashboard({ startup }: StartupDashboardProps) {
  const isMobile = useIsMobile();

  return (
    <main className="flex-1 w-full mx-auto p-8 flex flex-col items-center">
      {isMobile ? (
        <Tabs defaultValue="fund-pool" className="w-full">
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
      ) :
        <div className="grid grid-cols-2 gap-6 w-full">
          <div className="col-span-1">
            <ProgressCard startup={startup} />
          </div>
          <div className="col-span-1">
            <PitchDeck startup={startup} />
          </div>
        </div>
      }
    </main>
  )
}