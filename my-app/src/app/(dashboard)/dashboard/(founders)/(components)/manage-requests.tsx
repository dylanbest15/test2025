"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { FundPool } from "@/types/fund-pool"
import type { Investment } from "@/types/investment"
import type { Profile } from "@/types/profile"
import { ChevronDown, ChevronUp, DollarSign, Check, X } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import PreviousInvestors from "@/app/(dashboard)/dashboard/(founders)/(components)/previous-investors"
import { Startup } from "@/types/startup"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool
  profile: Profile
  startup: Startup
}

interface ManageRequestsProps {
  investments: JoinedInvestment[] | null
  onAcceptInvestment?: (investmentId: string) => void
  // TODO: decline investment
  onDeclineInvestment?: (investmentId: string) => void
}

export default function ManageRequests({
  investments,
  onAcceptInvestment,
  onDeclineInvestment,
}: ManageRequestsProps) {
  const [expandedCard, setExpandedCard] = useState<boolean>(false)
  const [showAcceptModal, setShowAcceptModal] = useState<boolean>(false)
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false)
  const [selectedInvestment, setSelectedInvestment] = useState<JoinedInvestment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Filter requests by status and sort by newest
  const needsActionInvestments = investments?.filter((investment) => investment.status === "needs action")
    .sort((a, b) => b.created_at.localeCompare(a.created_at)) || []
  const pendingInvestments = investments?.filter((investment) => investment.status === "pending")
    .sort((a, b) => b.updated_at!.localeCompare(a.updated_at!)) || []

  const displayRequests = needsActionInvestments.length + pendingInvestments.length

  const toggleCard = () => {
    setExpandedCard(!expandedCard)
  }

  const handleAcceptClick = (investment: JoinedInvestment, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card from collapsing
    setSelectedInvestment(investment)
    setShowAcceptModal(true)
  }

  const handleDeclineClick = (investment: JoinedInvestment, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card from collapsing
    setSelectedInvestment(investment)
    setShowDeclineModal(true)
  }

  const handleConfirmAccept = () => {
    if (selectedInvestment && onAcceptInvestment) {
      onAcceptInvestment(selectedInvestment.id)
    }
    setShowAcceptModal(false)
    setSelectedInvestment(null)
  }

  const handleCancelAccept = () => {
    setShowAcceptModal(false)
    setSelectedInvestment(null)
  }

  const handleConfirmDecline = () => {
    if (selectedInvestment && onDeclineInvestment) {
      onDeclineInvestment(selectedInvestment.id)
    }
    setShowDeclineModal(false)
    setSelectedInvestment(null)
  }

  const handleCancelDecline = () => {
    setShowDeclineModal(false)
    setSelectedInvestment(null)
  }

  const showPreviousInvestors = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the parent Link
    e.preventDefault()
    e.stopPropagation()
    setSheetOpen(true)
  }

  return (
    <>
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105" onClick={toggleCard}>
        <CardHeader>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Manage Requests</CardTitle>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!expandedCard && displayRequests > 0 && (
                <Badge variant="default" className="text-xs bg-blue-500">
                  {displayRequests}
                </Badge>
              )}
              {expandedCard ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          <CardDescription>Review and manage investment requests</CardDescription>
        </CardHeader>

        {expandedCard && (
          <CardContent className="pt-0">
            <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
              {displayRequests ? (
                <div className="space-y-3">

                  {/* Needs Action Requests */}
                  {needsActionInvestments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {investment.profile.first_name} {investment.profile.last_name}
                        </span>
                        <span className="text-sm text-gray-500">{formatCurrency(investment.amount)}</span>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 w-fit mt-1">Needs Action</Badge>
                      </div>
                      <div className="flex items-center">
                        <div className="flex flex-col space-y-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            onClick={(e) => handleAcceptClick(investment, e)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            onClick={(e) => handleDeclineClick(investment, e)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Pending Requests */}
                  {pendingInvestments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {investment.profile.first_name} {investment.profile.last_name}
                        </span>
                        <span className="text-sm text-gray-500">{formatCurrency(investment.amount)}</span>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 w-fit mt-1">Pending Investor Confirmation</Badge>
                      </div>
                      <div className="flex items-center">
                        <div className="flex flex-col space-y-1">
                          {/* <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            onClick={(e) => handleAcceptClick(investment, e)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Accept
                          </Button> */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            onClick={(e) => handleDeclineClick(investment, e)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No current investment requests</p>
                </div>
              )}

              <Button className="w-full" onClick={showPreviousInvestors} disabled={!investments}>
                {investments ? "View Previous Investors" : "No Previous Investors"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Accept Confirmation Modal */}
      <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Investment Request</DialogTitle>
            <DialogDescription>Are you sure you want to accept this investment request?</DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investor:</span>
                  <span className="text-sm font-medium">
                    {selectedInvestment.profile.first_name} {selectedInvestment.profile.last_name}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm">{selectedInvestment.profile.email}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investment Amount:</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(selectedInvestment.amount)}
                  </span>
                </div>
              </div>
            </div>
          )}

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
            <DialogTitle>Decline Investment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this investment request?
            </DialogDescription>
          </DialogHeader>

          {/* {selectedInvestment && (
            <div className="py-4">
              <div className="bg-red-50 rounded-lg p-4 space-y-2 border border-red-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investor:</span>
                  <span className="text-sm font-medium">
                    {selectedInvestment.profile.first_name} {selectedInvestment.profile.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm">{selectedInvestment.profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investment Amount:</span>
                  <span className="text-sm font-medium text-red-600">{formatCurrency(selectedInvestment.amount)}</span>
                </div>
              </div>
            </div>
          )} */}

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleCancelDecline}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDecline} variant="destructive" className="bg-red-600 hover:bg-red-700">
              <X className="w-4 h-4 mr-2" />
              Decline Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col [&>button]:hidden"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only"></SheetTitle>
          <PreviousInvestors investments={investments} onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}