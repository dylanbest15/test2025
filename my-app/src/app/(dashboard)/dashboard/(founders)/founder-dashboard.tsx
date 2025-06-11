"use client"

import { useEffect, useState } from "react"
import { TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ManageRequests from "@/app/(dashboard)/dashboard/(founders)/(components)/manage-requests"
import { Investment } from "@/types/investment"
import { FundPool } from "@/types/fund-pool"
import { Profile } from "@/types/profile"
import { Startup } from "@/types/startup"
import { updateInvestment } from "../actions"
import { toast } from "sonner"
import InvestorPool from "./(components)/investor-pool"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
  startup: Startup;
}

interface FounderDashboardProps {
  investments: JoinedInvestment[] | null
}

export default function FounderDashboard({ investments }: FounderDashboardProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [currentInvestments, setCurrentInvestments] = useState<JoinedInvestment[] | null>(investments);

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  const handleAcceptInvestment = async (investmentId: string) => {
    try {
      const updateData: Partial<Investment> = {
        status: 'pending'
      }

      const updatedInvestment = await updateInvestment(investmentId, updateData);

      // Replace the updated fields in the investments array
      setCurrentInvestments(currentInvestments =>
        currentInvestments?.map(investment =>
          investment.id === investmentId
            ? {
              ...investment,
              status: updatedInvestment.status,
              updated_at: updatedInvestment.updated_at
            }
            : investment
        ) || null
      )
      toast.success("Success!", {
        description: "You have accepted an investment request!",
      })
    } catch (error) {
      toast.error("Operation failed", {
        description: "Failed to accept investment request.",
      })
      console.error("Failed to update investment:", error)
      throw error
    }
  }

  const handleDeclineInvestment = async (investmentId: string) => {
    try {
      const updateData: Partial<Investment> = {
        status: 'declined'
      }

      const updatedInvestment = await updateInvestment(investmentId, updateData);

      // Replace the updated fields in the investments array
      setCurrentInvestments(currentInvestments =>
        currentInvestments?.map(investment =>
          investment.id === investmentId
            ? {
              ...investment,
              status: updatedInvestment.status,
              updated_at: updatedInvestment.updated_at
            }
            : investment
        ) || null
      )
      toast.success("Declined.", {
        description: "You have declined an investment request.",
      })
    } catch (error) {
      toast.error("Operation failed", {
        description: "Failed to decline investment request.",
      })
      console.error("Failed to update investment:", error)
      throw error
    }
  }

  useEffect(() => {
    setCurrentInvestments(investments);
  }, [investments]);

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                Dashboard
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Manage Requests Card - Left */}
            <ManageRequests 
              investments={currentInvestments} 
              onAcceptInvestment={handleAcceptInvestment}
              onDeclineInvestment={handleDeclineInvestment}
            />

            {/* My Fund Pool Card - Right */}
            <InvestorPool investments={currentInvestments} />
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
              {!expandedCard && <CardDescription>View detailed insights and reports</CardDescription>}
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
    </div>
  )
}