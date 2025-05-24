'use client'

import { useState } from "react";
import { ChevronRight, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { FundPool } from "@/types/fund-pool";
import FundingGoal from "@/app/(dashboard)/menu/(components)/(fund-pool)/funding-goal";
import ManageRequests from "@/app/(dashboard)/menu/(components)/(fund-pool)/manage-requests";

interface FundPoolSectionProps {
  fundPool: FundPool;
}

type SheetType =
  | "funding-goal"
  | "manage-requests"
  | null

export default function FundPoolSection({ fundPool }: FundPoolSectionProps) {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)
  const [currentFundPool, setCurrentFundPool] = useState<FundPool>(fundPool)

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">

          {/* Fund Pool Section */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <DollarSign size={18} />
                Fund Pool
              </h2>
              <Badge variant="secondary">admin</Badge>
            </div>
            <div className="mt-4">

              {/* Funding Goal */}
              <button
                onClick={() => setActiveSheet("funding-goal")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Funding Goal</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Manage Requests */}
              <button
                onClick={() => setActiveSheet("manage-requests")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Manage Requests</p>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Fund Pool Sheets */}
      <Sheet open={activeSheet === "funding-goal"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <FundingGoal fundPool={currentFundPool} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "manage-requests"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <ManageRequests fundPool={currentFundPool} onClose={() => setActiveSheet(null)} />
          </SheetContent>
      </Sheet>
    </div>
  )
}
