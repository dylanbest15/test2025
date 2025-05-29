"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FundPool } from "@/types/fund-pool"
import type { Investment } from "@/types/investment"
import { displayName, getInitials, type Profile } from "@/types/profile"
import { ChevronDown, ChevronUp, Check, X, AlertCircle, ArrowRight } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import type { Startup } from "@/types/startup"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import InvestmentDetails from "@/app/(dashboard)/dashboard/(founders)/(components)/investment-details"

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

export default function ManageRequests({ investments, onAcceptInvestment, onDeclineInvestment }: ManageRequestsProps) {
  const [expandedCard, setExpandedCard] = useState<boolean>(false)
  const [selectedInvestment, setSelectedInvestment] = useState<JoinedInvestment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Filter requests by status and sort by newest
  const needsActionInvestments =
    investments
      ?.filter((investment) => investment.status === "needs_action")
      .sort((a, b) => b.created_at.localeCompare(a.created_at)) || []
  const pendingInvestments =
    investments
      ?.filter((investment) => investment.status === "pending")
      .sort((a, b) => b.updated_at!.localeCompare(a.updated_at!)) || []

  const displayRequests = needsActionInvestments.length + pendingInvestments.length

  const toggleCard = () => {
    setExpandedCard(!expandedCard)
  }

  return (
    <>
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105" onClick={toggleCard}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Active Requests</CardTitle>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {displayRequests > 0 && (
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
          {!expandedCard && <CardDescription className="pt-2">Review and manage fund pool requests</CardDescription>}
        </CardHeader>

        {expandedCard && (
          <CardContent className="pt-0">
            <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
              {displayRequests ? (
                <div className="space-y-3">
                  {/* Needs Action Requests */}
                  {needsActionInvestments.map((investment) => (
                    <div
                      key={investment.id}
                      className="relative flex items-start p-2 pt-0 pb-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedInvestment(investment)
                        setSheetOpen(true)
                      }}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="relative -mt-1 -ml-2">
                            <Avatar className="h-12 w-12 border border-gray-200">
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
                          <div className="flex-1 min-w-">
                            <h3 className="font-semibold text-md text-gray-900 leading-tight">
                              {displayName(investment.profile)}
                            </h3>
                            <span className="text-md font-medium text-green-600">
                              {formatCurrency(investment.amount)}
                            </span>
                          </div>
                          
                        </div>
                      </div>
                      <div className="absolute right-4 flex flex-col items-end">
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 w-fit">Needs Action</Badge>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-500">View details</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
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
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 w-fit mt-1">
                          Pending Investor Confirmation
                        </Badge>
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
                          {/* <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            onClick={(e) => handleDeclineClick(investment, e)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Decline
                          </Button> */}
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
            </div>
          </CardContent>
        )}
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col [&>button]:hidden"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only"></SheetTitle>
          {selectedInvestment && (
            <InvestmentDetails 
              investment={selectedInvestment} 
              onConfirmAccept={onAcceptInvestment} 
              onConfirmDecline={onDeclineInvestment} 
              onBack={() => setSheetOpen(false)} />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}