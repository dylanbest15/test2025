"use client"

import type React from "react"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, PlusCircle, TrendingUp, DollarSign, ArrowLeft, X, Trophy } from "lucide-react"
import type { FundPool } from "@/types/fund-pool"
import { useState, useMemo } from "react"
import { FundPoolCreate } from "@/app/(dashboard)/my-startup/(view-startup)/(components)/fund-pool-create"
import type { Investment } from "@/types/investment"

interface FundPoolProps {
  fundPool: FundPool | null
  investments: Investment[] | []
  onCreateFundPool: (amount: number) => void
  onIncreaseFundGoal: (amount: number) => void
  onCloseFundPool: () => void
}

type OverlayView = "goal-reached" | "increase-goal" | "close-confirmation"

export default function FundPoolCard({
  fundPool,
  investments,
  onCreateFundPool,
  onIncreaseFundGoal,
  onCloseFundPool,
}: FundPoolProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [overlayView, setOverlayView] = useState<OverlayView>("goal-reached")
  const [newGoalAmount, setNewGoalAmount] = useState("")
  const [goalError, setGoalError] = useState("")
  const [showOverlay, setShowOverlay] = useState(true) // New state for overlay visibility

  // Calculate total confirmed investments
  const totalConfirmedInvestments = useMemo(() => {
    return investments
      .filter((investment) => investment.status === "confirmed")
      .reduce((total, investment) => total + investment.amount, 0)
  }, [investments])

  // Calculate needs_action/pending investments count
  const openInvestments = useMemo(() => {
    return investments.filter((investment) => investment.status === "needs_action" || investment.status === "pending")
      .length
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
    setOverlayView("increase-goal")
  }

  const handleCloseFundPool = () => {
    setOverlayView("close-confirmation")
  }

  const handleBackToGoalReached = () => {
    setOverlayView("goal-reached")
    setNewGoalAmount("")
    setGoalError("")
  }

  // New function to close the overlay
  const handleCloseOverlay = () => {
    setShowOverlay(false)
    setOverlayView("goal-reached") // Reset to default view
    setNewGoalAmount("")
    setGoalError("")
  }

  // New function to show the overlay
  const handleShowOverlay = () => {
    setShowOverlay(true)
    setOverlayView("goal-reached")
  }

  // Format input as currency
  const handleGoalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, "")
    if (value === "") {
      setNewGoalAmount("")
      return
    }

    // Convert to number and format as currency without decimals
    const numericValue = Number.parseInt(value, 10)
    if (!isNaN(numericValue)) {
      // Format with commas for thousands
      setNewGoalAmount(numericValue.toLocaleString("en-US"))
    }

    setGoalError("")
  }

  const handleSubmitNewGoal = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!newGoalAmount.trim()) {
      setGoalError("Please enter an amount")
      return
    }

    // Convert to number and validate
    const numericAmount = Number.parseInt(newGoalAmount.replace(/[^0-9]/g, ""), 10)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setGoalError("Please enter a valid amount")
      return
    }

    // Validate that new goal is higher than current goal
    if (fundPool && numericAmount <= fundPool.fund_goal) {
      setGoalError("New goal must be higher than current goal")
      return
    }

    // Reset and close
    setNewGoalAmount("")
    setGoalError("")
    onIncreaseFundGoal(numericAmount)
    handleCloseOverlay()
  }

  const handleConfirmClose = () => {
    console.log("Closing fund pool")
    onCloseFundPool()
    handleCloseOverlay()
  }

  const renderOverlayContent = () => {
    switch (overlayView) {
      case "increase-goal":
        return (
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackToGoalReached} className="p-1 h-8 w-8 mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-xl font-bold text-gray-900 flex-1">Increase Funding Goal</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseOverlay} className="p-1 h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Current goal achieved:{" "}
                <span className="font-semibold text-green-600">{formatCurrency(fundPool?.fund_goal || 0)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmitNewGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-goal-amount">New Funding Goal</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="new-goal-amount"
                    value={newGoalAmount}
                    onChange={handleGoalAmountChange}
                    className="pl-10"
                    placeholder="Enter new goal amount"
                  />
                </div>
                {goalError && <p className="text-sm text-red-500">{goalError}</p>}
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Update Funding Goal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToGoalReached}
                  className="w-full bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )

      case "close-confirmation":
        return (
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackToGoalReached} className="p-1 h-8 w-8 mr-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h3 className="text-xl font-bold text-gray-900 flex-1">Close Fund Pool</h3>
              <Button variant="ghost" size="sm" onClick={handleCloseOverlay} className="p-1 h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Are you sure you want to mark this fund pool as closed?{" "}
                {openInvestments > 0 && (
                  <>
                    <span className="font-medium text-orange-700">
                      {openInvestments} {openInvestments === 1 ? "investment request" : "investment requests"} will be
                      declined.
                    </span>{" "}
                  </>
                )}
                You will be able to create a new fund pool when you are ready to accept more investment requests.{" "}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirmClose}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-200"
              >
                <Check className="w-4 h-4 mr-2" />
                Yes, Close Fund Pool
              </Button>
              <Button onClick={handleBackToGoalReached} variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        )

      default: // 'goal-reached'
        return (
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="relative mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseOverlay}
                className="absolute top-0 right-0 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Goal Reached!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Amazing! You've successfully raised{" "}
                  <span className="font-semibold text-green-600">{formatCurrency(fundPool?.fund_goal || 0)}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleIncreaseFundingGoal}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Increase Fund Goal
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
        )
    }
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

        {/* Goal Reached Badge with See Next Steps */}
        {fundPool && isFundingGoalReached && !showOverlay && (
          <div className="absolute right-0 top-0 z-10 flex flex-col items-end">
            <Badge
              variant="outline"
              className="rounded-none rounded-bl-md bg-green-50 text-green-700 border-green-200 px-3 py-1.5 font-medium"
            >
              <Trophy className="w-4 h-4 mr-1" />
              Goal Reached
            </Badge>
            <button
              onClick={handleShowOverlay}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 mr-2 transition-colors"
            >
              See Next Steps
            </button>
          </div>
        )}

        {/* Funding Goal Reached Overlay */}
        {fundPool && isFundingGoalReached && showOverlay && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-25 flex items-center justify-center p-4 pb-12">
            {renderOverlayContent()}
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
