"use client"

import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { FundPool } from "@/types/fund-pool"
import { useState } from "react"
import { FundPoolCreate } from "@/app/(dashboard)/my-startup/(view-startup)/fund-pool-create"

interface FundPoolProps {
  fundPool: FundPool | null;
  onCreateFundPool: (amount: number) => void
}

export default function FundPoolCard({ fundPool, onCreateFundPool }: FundPoolProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreateFundPool = (amount: number) => {
    if (onCreateFundPool) {
      onCreateFundPool(amount)
    }
    setDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardContent>
          {fundPool ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Funding Goal</p>
                  <p className="text-xl font-bold">{formatCurrency(fundPool.fund_goal)}</p>
                </div>
                <Badge
                  variant={fundPool.status === "open" ? "outline" : "default"}
                  className={fundPool.status === "open" ? "bg-green-50 text-green-700 border-green-200" : ""}
                >
                  {fundPool.status === "open" ? "Open for funding" : "Completed"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>$0 of {formatCurrency(fundPool.fund_goal)}</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">No fund pool has been created yet.</p>
              <Button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => setDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Create Fund Pool
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FundPoolCreate open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreateFundPool} />
    </>
  )
}