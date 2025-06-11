'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { FundPool } from "@/types/fund-pool"
import { Investment } from "@/types/investment"
import { Profile } from "@/types/profile"
import { Startup } from "@/types/startup"
import { ArrowLeft, Building2, Calendar, Check, MailIcon, MapPinIcon, X } from "lucide-react"
import { useState } from "react"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool
  profile: Profile
  startup: Startup
}

interface InvestmentDetailsProps {
  investment: JoinedInvestment
  onConfirmConfirm?: (invesmentId: string) => void
  onConfirmWithdraw?: (invesmentId: string) => void
  onBack: () => void
}

export default function InvestmentDetails({ investment, onConfirmConfirm, onConfirmWithdraw, onBack }: InvestmentDetailsProps) {
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false)

  const handleConfirmClick = () => {
    setShowConfirmModal(true)
  }

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true)
  }

  const handleConfirmConfirm = () => {
    if (onConfirmConfirm) {
      onConfirmConfirm(investment.id)
    }
    setShowConfirmModal(false)
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
  }

  const handleConfirmWithdraw = () => {
    if (onConfirmWithdraw) {
      onConfirmWithdraw(investment.id)
    }
    setShowWithdrawModal(false)
  }

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false)
  }

  return (
    <>
      <div className="h-full overflow-auto bg-[#f8f9fa]">
        {onBack && (
          <div className="top-0 z-10 pt-4 pl-4">
            <button
              onClick={onBack}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </button>
          </div>
        )}
        <div className="container mx-auto py-4 px-4">
          <div className="space-y-2">
            {/* Header Section with Logo and Name */}
            <div className="flex items-start gap-4 bg-white p-4">
              <div className="relative">
                {investment.startup.logo_url ? (
                  <div className="h-20 w-20 border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                    <img
                      src={investment.startup.logo_url || "/placeholder.svg"}
                      alt={`${investment.startup.name || "Company"} logo`}
                      className="object-contain max-h-full max-w-full"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Building2 className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Name and details */}
              <div className="space-y-2">
                <h1 className="text-xl font-bold">{investment.startup.name}</h1>
                <div className="flex flex-col text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    <span>
                      {investment.startup.city}, {investment.startup.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MailIcon className="h-3 w-3" />
                    <span>{investment.startup.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Founded in {investment.startup.year_founded}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio section with See More */}
            <div className="bg-white p-4">
              <h2 className="font-semibold text-gray-900 pb-1">Overview</h2>
              <div className="overflow-hidden transition-all duration-300 ease-in-out">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isOverviewExpanded
                    ? investment.startup.overview
                    : investment.startup.overview && investment.startup.overview.length > 75
                      ? investment.startup.overview.substring(0, 75)
                      : investment.startup.overview}
                  {investment.startup.overview && investment.startup.overview.length > 75 && (
                    <>
                      {!isOverviewExpanded && "..."}
                      <button
                        onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                        className="ml-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors inline"
                      >
                        {isOverviewExpanded ? " See Less" : " See More"}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Investment Section */}
            <Card className="relative overflow-hidden rounded-none border-0 shadow-none pt-4 pb-5">
              <CardContent>
                <div className="space-y-1">
                  {/* Header */}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {investment.status === "needs_action"
                      ? "Fund Pool Request Pending..."
                      : investment.status === "pending"
                        ? "Fund Pool Request Accepted!"
                        : investment.status === "confirmed"
                          ? "Investment Confirmed!"
                          : "Request Details"}
                  </h2>

                  {/* Status Badge */}
                  <div className="flex justify-start">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${investment.status === "needs_action"
                        ? "bg-blue-100 text-blue-800"
                        : investment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : investment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {investment.status === "needs_action"
                        ? "Pending - Waiting for Startup to Review"
                        : investment.status === "pending"
                          ? "Needs Action - Accepted by Startup"
                          : investment.status === "confirmed"
                            ? "Confirmed"
                            : investment.status}
                    </span>
                  </div>

                  {/* Investment Amount - Centered */}
                  <div className="py-6">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-green-600">{formatCurrency(investment.amount)}</span>
                    </div>

                    {/* Date Information */}
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        {investment.status === "needs_action" && (
                          <span>Requested on {new Date(investment.created_at).toLocaleDateString()}</span>
                        )}
                        {investment.status === "pending" && (
                          <div>
                            {/* <div>Requested on {new Date(investment.created_at).toLocaleDateString()}</div> */}
                            {investment.updated_at && <div>Accepted on {new Date(investment.updated_at).toLocaleDateString()}</div>}
                          </div>
                        )}
                        {investment.status === "confirmed" && investment.updated_at && (
                          <span>Finalized on {new Date(investment.updated_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                 {/* Explanation Section */}
                 <p className="text-sm text-gray-600 leading-relaxed">
                    {investment.status === "needs_action"
                      ? "You have submitted this request and are waiting for the startup to review. If they accept, you will be notified and must confirm to finalize the deal."
                      : investment.status === "pending"
                        ? "Upon confirming this request, the investment will be finalized and added to the startup's fund pool."
                        : investment.status === "confirmed"
                          ? "This investment has been finalized."
                          : ""
                    }
                  </p>

                  {/* Action Buttons - Right aligned */}
                  <div className="flex justify-end gap-2 pt-6">
                    {/* Withdraw button - always shown */}
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                      onClick={() => handleWithdrawClick()}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Withdraw
                    </Button>

                    {/* Confirm button - only shown for pending status */}
                    {investment.status === "pending" && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-8 px-3 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => handleConfirmClick()}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Confirm
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirm Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Fund Pool Request</DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Investor:</span>
                <span className="text-sm font-medium">
                  {investment.profile.first_name} {investment.profile.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(investment.amount)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleCancelConfirm}>
              Cancel
            </Button>
            <Button onClick={handleConfirmConfirm} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Confirm Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Fund Pool Request</DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Investor:</span>
                <span className="text-sm font-medium">
                  {investment.profile.first_name} {investment.profile.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(investment.amount)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleCancelWithdraw}>
              Cancel
            </Button>
            <Button onClick={handleConfirmWithdraw} variant="destructive" className="bg-red-600 hover:bg-red-700">
              <X className="w-4 h-4 mr-2" />
              Withdraw Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}