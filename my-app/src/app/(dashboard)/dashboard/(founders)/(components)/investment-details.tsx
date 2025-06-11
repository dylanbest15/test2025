"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import type { FundPool } from "@/types/fund-pool"
import type { Investment } from "@/types/investment"
import { displayName, getInitials, type Profile } from "@/types/profile"
import type { Startup } from "@/types/startup"
import { ArrowLeft, Check, MailIcon, X } from "lucide-react"
import { useState } from "react"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool
  profile: Profile
  startup: Startup
}

interface InvestmentDetailsProps {
  investment: JoinedInvestment
  onConfirmAccept?: (invesmentId: string) => void
  onConfirmDecline?: (invesmentId: string) => void
  onBack: () => void
}

export default function InvestmentDetails({
  investment,
  onConfirmAccept,
  onConfirmDecline,
  onBack,
}: InvestmentDetailsProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const [showAcceptModal, setShowAcceptModal] = useState<boolean>(false)
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false)

  const handleAcceptClick = () => {
    setShowAcceptModal(true)
  }

  const handleDeclineClick = () => {
    setShowDeclineModal(true)
  }

  const handleConfirmAccept = () => {
    if (onConfirmAccept) {
      onConfirmAccept(investment.id)
    }
    setShowAcceptModal(false)
    onBack()
  }

  const handleCancelAccept = () => {
    setShowAcceptModal(false)
  }

  const handleConfirmDecline = () => {
    if (onConfirmDecline) {
      onConfirmDecline(investment.id)
    }
    setShowDeclineModal(false)
    onBack()
  }

  const handleCancelDecline = () => {
    setShowDeclineModal(false)
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
            {/* Header Section with Profile and Name */}
            <div className="flex items-start gap-4 bg-white p-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border border-gray-200">
                  <AvatarImage
                    src={investment.profile.avatar_url || "/placeholder.svg"}
                    alt={displayName(investment.profile)}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {getInitials(investment.profile)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name and details */}
              <div className="space-y-2">
                <h1 className="text-xl font-bold">{displayName(investment.profile)}</h1>
                <div className="flex flex-col text-xs text-gray-400">
                  {/* <div className="flex items-center gap-1">
                <MapPinIcon className="h-3 w-3" />
                <span>
                  {startup.city}, {startup.state}
                </span>
              </div> */}
                  <div className="flex items-center gap-1">
                    <MailIcon className="h-3 w-3" />
                    <span>{investment.profile.email}</span>
                  </div>
                </div>
                {/* {industries && industries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {industries.map((industry, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 h-auto">
                    {industry}
                  </Badge>
                ))}
              </div>
            )} */}
              </div>
            </div>

            {/* Bio section with See More */}
            <div className="bg-white p-4">
              <h2 className="font-semibold text-gray-900 pb-1">Investor Bio</h2>
              <div className="overflow-hidden transition-all duration-300 ease-in-out">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isBioExpanded
                    ? investment.profile.bio
                    : investment.profile.bio && investment.profile.bio.length > 75
                      ? investment.profile.bio.substring(0, 75)
                      : investment.profile.bio}
                  {investment.profile.bio && investment.profile.bio.length > 75 && (
                    <>
                      {!isBioExpanded && "..."}
                      <button
                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                        className="ml-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors inline"
                      >
                        {isBioExpanded ? " See Less" : " See More"}
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
                      ? "New Fund Pool Request!"
                      : investment.status === "pending"
                        ? "Fund Pool Request Accepted!"
                        : investment.status === "confirmed"
                          ? "Invesment Confirmed!"
                          : "Request Details"}
                  </h2>

                  {/* Status Badge */}
                  <div className="flex justify-start">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${investment.status === "needs_action"
                        ? "bg-yellow-100 text-yellow-800"
                        : investment.status === "pending"
                          ? "bg-blue-100 text-blue-800"
                          : investment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {investment.status === "needs_action"
                        ? "Needs Action"
                        : investment.status === "pending"
                          ? "Accepted - Pending Investor Confirmation"
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
                      ? "Upon accepting this request, the investor will receive a notification to confirm the deal. If you choose to decline, the investor will be notified and can submit a new request."
                      : investment.status === "pending"
                        ? "You have accepted this request and are awaiting investor confirmation. When they confirm, the investment will be finalized and the amount will be added to your fund pool."
                        : investment.status === "confirmed"
                          ? "This investment has been finalized and the amount was added to your fund pool."
                          : ""
                    }
                  </p>

                  {/* Action Buttons - Right aligned */}
                  <div className="flex justify-end gap-2 pt-6">
                    {/* Decline button - always shown */}
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                      onClick={() => handleDeclineClick()}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Decline
                    </Button>

                    {/* Accept button - only shown for needs_action status */}
                    {investment.status === "needs_action" && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-8 px-3 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        onClick={() => handleAcceptClick()}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Fund Pool Request</DialogTitle>
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
            <Button variant="outline" onClick={handleCancelAccept}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAccept} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" />
              Accept Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Confirmation Modal */}
      <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Fund Pool Request</DialogTitle>
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
            <Button variant="outline" onClick={handleCancelDecline}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDecline} variant="destructive" className="bg-red-600 hover:bg-red-700">
              <X className="w-4 h-4 mr-2" />
              Decline Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}