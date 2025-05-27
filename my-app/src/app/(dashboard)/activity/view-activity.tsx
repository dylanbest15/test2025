"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import InvestorSearch from "@/app/(dashboard)/activity/(search)/investor-search"
import type { Favorite } from "@/types/favorite"
import type { Startup } from "@/types/startup"
import ViewFavorites from "@/app/(dashboard)/activity/(favorites)/view-favorites"

interface JoinedFavorite extends Favorite {
  startup: Startup
}

interface ViewActivityProps {
  profileType: string
  favorites: JoinedFavorite[] | null
}

export default function ViewActivity({ profileType, favorites }: ViewActivityProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="w-screen min-h-screen px-4 py-2">
      <div className="w-full max-w-5xl mx-auto">
        <div className="space-y-2">
          <Tabs defaultValue="dashboard" className="w-full mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="search">{profileType === "founder" ? "Search" : "Favorites"}</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div>Dashboard content</div>
            </TabsContent>

            <TabsContent value="search">
              {profileType === "founder" ? <InvestorSearch /> : <ViewFavorites favorites={favorites} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}