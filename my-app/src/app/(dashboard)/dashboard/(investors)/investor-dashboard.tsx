'use client'

import { FundPool } from "@/types/fund-pool";
import { Investment } from "@/types/investment";
import { Profile } from "@/types/profile";
import { Startup } from "@/types/startup";
import ManageRequests from "@/app/(dashboard)/dashboard/(investors)/(components)/manage-requests";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateInvestment } from "@/app/(dashboard)/dashboard/actions";
import InvestmentHistory from "@/app/(dashboard)/dashboard/(investors)/(components)/investment-history";

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
  startup: Startup;
}

interface InvestorDashboardProps {
  investments: JoinedInvestment[] | null
}

export default function InvestorDashboard({ investments }: InvestorDashboardProps) {
  const [currentInvestments, setCurrentInvestments] = useState<JoinedInvestment[] | null>(investments);

  const handleConfirmInvestment = async (investmentId: string) => {
    try {
      const updateData: Partial<Investment> = {
        status: 'confirmed'
      }

      const updatedInvestment = await updateInvestment(investmentId, updateData);

      // Replace the updated fields in the investments array
      setCurrentInvestments(currentInvestments =>
        currentInvestments?.map(investment =>
          investment.id === investmentId
            ? {
              ...investment,
              status: updatedInvestment.status,
              updated_at: updatedInvestment.updated_at
            }
            : investment
        ) || null
      )
      toast.success("Success!", {
        description: "You have confirmed an investment request!",
      })
    } catch (error) {
      toast.error("Operation failed", {
        description: "Failed to confirmed investment request.",
      })
      console.error("Failed to update investment:", error)
      throw error
    }
  }

  useEffect(() => {
    setCurrentInvestments(investments);
  }, [investments]);

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                Dashboard
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* Manage Requests Card - Left */}
            <ManageRequests investments={currentInvestments} onConfirmInvestment={handleConfirmInvestment} />

            {/* Investor History Card - Right */}
            <InvestmentHistory investments={currentInvestments} />
          </div>
        </div>
      </div>
    </div>
  )
}