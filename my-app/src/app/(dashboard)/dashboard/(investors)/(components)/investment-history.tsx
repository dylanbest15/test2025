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
  const confirmedInvestments = investments?.filter((investment) => investment.status === "confirmed")
    .sort((a, b) => b.created_at.localeCompare(a.created_at)) || []

  const displayRequests = confirmedInvestments.length

  const toggleCard = () => {
    setExpandedCard(!expandedCard)
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
                <CardTitle className="text-lg">Investment History</CardTitle>
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
          <CardDescription>View all confirmed investments</CardDescription>
        </CardHeader>

        {expandedCard && (
          <CardContent className="pt-0">
            <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
              {displayRequests ? (
                <div className="space-y-3">

                  {/* Confirmed Investments */}
                  {confirmedInvestments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {investment.startup.name}
                        </span>
                        <span className="text-sm text-gray-500">{formatCurrency(investment.amount)}</span>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 w-fit mt-1">Confirmed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No confirmed investments</p>
                </div>
              )}

              <Button className="w-full" onClick={showPreviousInvestors} disabled={!investments}>
                {investments ? "View Previous Investors" : "No Previous Investors"}
              </Button>
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
          <PreviousInvestors investments={investments} onClose={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}