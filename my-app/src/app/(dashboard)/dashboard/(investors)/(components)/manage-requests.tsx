"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FundPool } from "@/types/fund-pool"
import type { Investment } from "@/types/investment"
import type { Profile } from "@/types/profile"
import { Check, ChevronDown, ChevronUp, DollarSign, X } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Startup } from "@/types/startup"
import PreviousInvestments from "@/app/(dashboard)/dashboard/(investors)/(components)/previous-investments"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool
  profile: Profile
  startup: Startup
}

interface ManageRequestsProps {
  investments: JoinedInvestment[] | null
  onConfirmInvestment?: (investmentId: string) => void
  // TODO: withdraw investment
  onWithdrawInvestment?: (investmentId: string) => void
}

export default function ManageRequests({
  investments,
  onConfirmInvestment,
  onWithdrawInvestment,
}: ManageRequestsProps) {
  const [expandedCard, setExpandedCard] = useState<boolean>(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false)
  const [selectedInvestment, setSelectedInvestment] = useState<JoinedInvestment | null>(null)

  // Filter requests by status and sort by newest
  const needsActionInvestments = investments?.filter((investment) => investment.status === "needs_action")
    .sort((a, b) => b.created_at.localeCompare(a.created_at)) || []
  const pendingInvestments = investments?.filter((investment) => investment.status === "pending")
    .sort((a, b) => b.updated_at!.localeCompare(a.updated_at!)) || []

  const displayRequests = needsActionInvestments.length + pendingInvestments.length

  const toggleCard = () => {
    setExpandedCard(!expandedCard)
  }

  const handleConfirmClick = (investment: JoinedInvestment, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card from collapsing
    setSelectedInvestment(investment)
    setShowConfirmModal(true)
  }

  const handleWithdrawClick = (investment: JoinedInvestment, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card from collapsing
    setSelectedInvestment(investment)
    setShowWithdrawModal(true)
  }

  const handleConfirmConfirm = () => {
    if (selectedInvestment && onConfirmInvestment) {
      onConfirmInvestment(selectedInvestment.id)
    }
    setShowConfirmModal(false)
    setSelectedInvestment(null)
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
    setSelectedInvestment(null)
  }

  const handleConfirmWithdraw = () => {
    if (selectedInvestment && onWithdrawInvestment) {
      onWithdrawInvestment(selectedInvestment.id)
    }
    setShowWithdrawModal(false)
    setSelectedInvestment(null)
  }

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false)
    setSelectedInvestment(null)
  }

  const showPreviousInvestments = (e: React.MouseEvent) => {
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
                          {investment.startup.name}
                        </span>
                        <span className="text-sm text-gray-500">{formatCurrency(investment.amount)}</span>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 w-fit mt-1">Awaiting Startup Action</Badge>
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
                            onClick={(e) => handleWithdrawClick(investment, e)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Withdraw
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
                          {investment.startup.name}
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
                            onClick={(e) => handleConfirmClick(investment, e)}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            onClick={(e) => handleWithdrawClick(investment, e)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Withdraw
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

              <Button className="w-full" onClick={showPreviousInvestments} disabled={!investments}>
                {investments ? "View Previous Investors" : "No Previous Investors"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Confirm Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Investment Request</DialogTitle>
            <DialogDescription>Are you sure you want to confirm this investment request?</DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Startup:</span>
                  <span className="text-sm font-medium">
                    {selectedInvestment.startup.name}
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
            <DialogTitle>Withdraw Investment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw this investment request?
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
            <Button variant="outline" onClick={handleCancelWithdraw}>
              Cancel
            </Button>
            <Button onClick={handleConfirmWithdraw} variant="destructive" className="bg-red-600 hover:bg-red-700">
              <X className="w-4 h-4 mr-2" />
              Withdraw Request
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
          <PreviousInvestments investments={investments} onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}