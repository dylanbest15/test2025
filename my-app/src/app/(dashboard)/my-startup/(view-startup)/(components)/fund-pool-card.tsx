"use client"

import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Check, PlusCircle, TrendingUp } from "lucide-react"
import type { FundPool } from "@/types/fund-pool"
import { useState, useMemo } from "react"
import { FundPoolCreate } from "@/app/(dashboard)/my-startup/(view-startup)/(components)/fund-pool-create"
import type { Investment } from "@/types/investment"

interface FundPoolProps {
  fundPool: FundPool | null
  investments: Investment[] | []
  onCreateFundPool: (amount: number) => void
  onIncreaseFundGoal: () => void
  onCloseFundPool: () => void
}

export default function FundPoolCard({
  fundPool,
  investments,
  onCreateFundPool,
  onIncreaseFundGoal,
  onCloseFundPool
}: FundPoolProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  // Calculate total confirmed investments
  const totalConfirmedInvestments = useMemo(() => {
    return investments
      .filter((investment) => investment.status === "confirmed")
      .reduce((total, investment) => total + investment.amount, 0)
  }, [investments])

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!fundPool?.fund_goal || fundPool.fund_goal === 0) return 0
    return Math.min((totalConfirmedInvestments / fundPool.fund_goal) * 100, 100)
  }, [totalConfirmedInvestments, fundPool])

  // Check if funding goal is reached
  const isFundingGoalReached = useMemo(() => {
    return fundPool && totalConfirmedInvestments >= fundPool.fund_goal
  }, [totalConfirmedInvestments, fundPool])

  const handleCreateFundPool = (amount: number) => {
    if (onCreateFundPool) {
      onCreateFundPool(amount)
    }
    setDialogOpen(false)
  }

  const handleIncreaseFundingGoal = () => {
    onIncreaseFundGoal()
  }

  const handleCloseFundPool = () => {
    onCloseFundPool()
  }

  return (
    <>
      <Card className="relative overflow-hidden rounded-none border-0 shadow-none">
        {fundPool?.status === "open" && !isFundingGoalReached && (
          <div className="absolute right-0 top-0 z-10">
            <Badge
              variant="outline"
              className="rounded-none rounded-bl-md bg-green-50 text-green-700 border-green-200 px-3 py-1.5 font-medium"
            >
              Open for funding
            </Badge>
          </div>
        )}

        {/* Funding Goal Reached Overlay */}
        {fundPool && isFundingGoalReached && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-25 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Goal Reached!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Amazing! You've successfully raised{" "}
                  <span className="font-semibold text-green-600">{formatCurrency(fundPool.fund_goal)}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleIncreaseFundingGoal}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Increase Funding Goal
                </Button>

                <Button
                  onClick={handleCloseFundPool}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-200"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Close Fund Pool
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardContent className="p-6 pt-0 pb-0">
          {fundPool ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Funding Goal</p>
                <p className="text-2xl font-bold">{formatCurrency(fundPool.fund_goal)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span>
                    {formatCurrency(totalConfirmedInvestments)} of{" "}
                    <span className="font-bold">{formatCurrency(fundPool.fund_goal)}</span>
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className={`h-2.5 ${isFundingGoalReached ? "[&>div]:bg-green-600" : "[&>div]:bg-green-500"}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className={isFundingGoalReached ? "text-green-600 font-medium" : ""}>
                    {progressPercentage.toFixed(1)}% funded
                  </span>
                  <span>
                    {(() => {
                      const confirmedCount = investments.filter((inv) => inv.status === "confirmed").length
                      return `${confirmedCount} ${confirmedCount === 1 ? "investor" : "investors"}`
                    })()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-6">No fund pool has been created yet.</p>
              <Button
                className="w-full py-6 text-base font-semibold shadow-lg transition-all duration-200 
                bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                border-0 relative overflow-hidden group"
                onClick={() => setDialogOpen(true)}
              >
                <div className="absolute inset-0 w-3 bg-white/20 skew-x-[-20deg] group-hover:animate-shimmer" />
                <div className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Fund Pool</span>
                </div>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FundPoolCreate open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreateFundPool} />
    </>
  )
}