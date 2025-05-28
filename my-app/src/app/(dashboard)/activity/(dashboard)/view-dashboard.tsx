"use client"

import { useState } from "react"
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ManageRequests from "@/app/(dashboard)/activity/(dashboard)/(components)/manage-requests"
import { Investment } from "@/types/investment"
import { FundPool } from "@/types/fund-pool"
import { Profile } from "@/types/profile"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
}

interface ViewDashboardProps {
  investments: JoinedInvestment[] | null
}

export default function ViewDashboard({ investments }: ViewDashboardProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <div className="pt-2 space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* My Fund Pool Card - Left */}
          {/* <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            onClick={() => toggleCard("fund-pool")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Wallet className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Fund Pool</CardTitle>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {expandedCard === "fund-pool" ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              <CardDescription>Monitor and manage your fund allocation</CardDescription>
            </CardHeader>

            {expandedCard === "fund-pool" && (
              <CardContent className="pt-0">
                <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">$45,230</div>
                      <div className="text-sm text-blue-800">Available Balance</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">$12,770</div>
                      <div className="text-sm text-green-800">Allocated This Month</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Budget Usage</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Fund Pool
                  </Button>
                </div>
              </CardContent>
            )}
          </Card> */}

          {/* Manage Requests Card - Right */}
          <ManageRequests investments={investments} />
        </div>

        {/* Bottom row - Analytics taking full width */}
        <Card
          className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
          onClick={() => toggleCard("analytics")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <TrendingUp className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {expandedCard === "analytics" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
            <CardDescription>View detailed insights and reports</CardDescription>
          </CardHeader>

          {expandedCard === "analytics" && (
            <CardContent className="pt-0">
              <div className="animate-in slide-in-from-top-2 duration-300 space-y-4 text-center">
                <div className="p-8 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-500 mb-4">
                    Advanced analytics and reporting features are currently in development.
                  </p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}