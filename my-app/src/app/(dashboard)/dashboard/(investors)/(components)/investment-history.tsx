"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FundPool } from "@/types/fund-pool"
import type { Investment } from "@/types/investment"
import type { Profile } from "@/types/profile"
import { ChevronDown, ChevronUp, DollarSign, Building2, ArrowRight } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Startup } from "@/types/startup"
import InvestmentDetails from "@/app/(dashboard)/dashboard/(investors)/(components)/investment-details"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool
  profile: Profile
  startup: Startup
}

interface InvestmentHistoryProps {
  investments: JoinedInvestment[] | null
}

export default function InvestmentHistory({
  investments,
}: InvestmentHistoryProps) {
  const [expandedCard, setExpandedCard] = useState<boolean>(false)
  const [selectedInvestment, setSelectedInvestment] = useState<JoinedInvestment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Filter investments by status and sort by newest
  const filteredInvestments = investments?.filter((investment) => investment.status === "confirmed")
    .sort((a, b) => a.startup.name.localeCompare(b.startup.name)) || []

  const displayRequests = filteredInvestments.length

  const toggleCard = () => {
    setExpandedCard(!expandedCard)
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
                <CardTitle className="text-lg">Investment History</CardTitle>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {displayRequests > 0 && (
                <Badge variant="default" className="text-xs bg-green-500">
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
          {!expandedCard && <CardDescription>View all confirmed investments</CardDescription>}
        </CardHeader>

        {expandedCard && (
          <CardContent className="pt-0">
            <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
              {displayRequests ? (
                <div className="space-y-3">
                  {filteredInvestments.map((investment) => (
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
                            {investment.startup.logo_url ? (
                              <div className="h-12 w-12 border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                                <img
                                  src={investment.startup.logo_url || "/placeholder.svg"}
                                  alt={`${investment.startup.name || "Company"} logo`}
                                  className="object-contain max-h-full max-w-full"
                                  style={{ objectPosition: "center" }}
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 flex items-center justify-center border border-gray-200">
                                <Building2 className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-20">
                            <h3 className="font-semibold text-sm text-gray-900 leading-tight">
                              {investment.startup.name}
                            </h3>
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(investment.amount)}
                            </span>
                          </div>

                        </div>
                      </div>
                      <div className="absolute right-1 -top-1 flex flex-col items-end">
                        <Badge className="text-xs bg-green-100 text-green-800 w-fit mt-1">Confirmed</Badge>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-500">View details</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No confirmed investments</p>
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
              onBack={() => setSheetOpen(false)} />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}