"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import InvestorSearch from "@/app/(dashboard)/activity/(investors)/investor-search"
import type { Favorite } from "@/types/favorite"
import type { Startup } from "@/types/startup"
import ViewFavorites from "@/app/(dashboard)/activity/(favorites)/view-favorites"
import ViewDashboard from "@/app/(dashboard)/activity/(dashboard)/view-dashboard"
import { Investment } from "@/types/investment"
import { FundPool } from "@/types/fund-pool"
import { Profile } from "@/types/profile"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
}

interface JoinedFavorite extends Favorite {
  startup: Startup
}

interface ViewActivityProps {
  profileType: string
  investments: JoinedInvestment[] | null
  favorites: JoinedFavorite[] | null
}

export default function ViewActivity({ profileType, investments, favorites }: ViewActivityProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="w-screen min-h-screen px-4 py-2">
      <div className="w-full max-w-5xl mx-auto">
        <div className="space-y-2">
          <Tabs defaultValue="dashboard" className="w-full mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="investors">{profileType === "founder" ? "Investors" : "Favorites"}</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <ViewDashboard investments={investments} />
            </TabsContent>

            <TabsContent value="investors">
              {profileType === "founder" ? <InvestorSearch /> : <ViewFavorites favorites={favorites} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}