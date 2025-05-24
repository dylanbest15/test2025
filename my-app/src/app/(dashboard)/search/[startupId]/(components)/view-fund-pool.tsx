"use client"

import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { FundPool } from "@/types/fund-pool"
import { JoinFundPool } from "@/app/(dashboard)/search/[startupId]/(components)/join-fund-pool"
import { useState } from "react"

interface ViewFundPoolProps {
  fundPool?: FundPool | null
  onJoinFundPool: (amount: number) => void
}

export default function ViewFundPoolCard({ fundPool, onJoinFundPool }: ViewFundPoolProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleJoinFundPool = (amount: number) => {
    if (onJoinFundPool) {
      onJoinFundPool(amount)
    }
    setDialogOpen(false)
  }

  return (
    <>
      <Card className="relative overflow-hidden border-2">
        {fundPool?.status === "open" && (
          <div className="absolute right-0 top-0">
            <Badge
              variant="outline"
              className="rounded-none rounded-bl-md bg-green-50 text-green-700 border-green-200 px-3 py-1.5 font-medium"
            >
              Open for funding
            </Badge>
          </div>
        )}

        <CardContent className="p-6">
          {fundPool ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Funding Goal</p>
                <p className="text-2xl font-bold">{formatCurrency(fundPool.fund_goal)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span>$0 of {formatCurrency(fundPool.fund_goal)}</span>
                </div>
                <Progress value={0} className="h-2.5" />
              </div>

              {/* TODO: only show button to investors */}
              <div className="pt-2">
                <Button
                  className="w-full py-6 text-base font-semibold shadow-lg transition-all duration-200 
                  bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                  border-0 relative overflow-hidden group"
                  onClick={() => setDialogOpen(true)}
                >
                  <div className="absolute inset-0 w-3 bg-white/20 skew-x-[-20deg] group-hover:animate-shimmer" />
                  <div className="flex items-center justify-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    <span>Join Fund Pool</span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No fund pool has been created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <JoinFundPool open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleJoinFundPool} />
    </>
  )
}