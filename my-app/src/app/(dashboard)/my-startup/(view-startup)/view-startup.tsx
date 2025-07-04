"use client"

import { useCallback, useState } from "react"
import type { Startup } from "@/types/startup"
import type { FundPool } from "@/types/fund-pool"
import { createFundPool } from "@/app/(dashboard)/my-startup/actions"
import { toast } from "sonner"
import ViewStartupMobile from "@/app/(dashboard)/my-startup/(view-startup)/(views)/view-startup-mobile"
import ViewStartupDesktop from "@/app/(dashboard)/my-startup/(view-startup)/(views)/view-startup-desktop"
import type { Investment } from "@/types/investment"
import { updateFundPool, updateInvestment } from "@/app/(dashboard)/dashboard/actions"

interface ViewStartupProps {
  startup: Startup
  industries: string[]
  openFundPool: FundPool | null
  fundPools: FundPool[] | []
  investments: Investment[] | []
}

export default function ViewStartup({ startup, industries, openFundPool, fundPools, investments }: ViewStartupProps) {
  const [currentFundPool, setCurrentFundPool] = useState<FundPool | null>(openFundPool)

  const handleCreateFundPool = useCallback(
    async (amount: number) => {
      try {
        const fundPoolData: Partial<FundPool> = {
          startup_id: startup.id,
          fund_goal: amount,
        }

        const newFundPool = await createFundPool(fundPoolData)

        // Update the local state with the new data
        setCurrentFundPool((prev) => ({
          ...prev,
          ...newFundPool,
        }))

        toast.success("Success!", {
          description: "Your fund pool has been created successfully.",
        })

        return true
      } catch (error) {
        toast.error("Operation failed", {
          description: "Failed to create fund pool.",
        })
        console.error("Failed to create fund pool:", error)
        throw error
      }
    },
    [startup.id],
  )

  const handleInceaseFundGoal = useCallback(
    async (amount: number) => {
      // Check if currentFundPool exists and has an id
      if (!currentFundPool?.id) {
        toast.error("Operation failed", {
          description: "No fund pool found to update.",
        })
        return false
      }

      try {
        const updateData: Partial<FundPool> = {
          fund_goal: amount,
        }

        const newFundPool = await updateFundPool(currentFundPool.id, updateData)

        // Update the local state with the new data
        setCurrentFundPool((prev) => ({
          ...prev,
          ...newFundPool,
        }))

        toast.success("Success!", {
          description: "Your fund goal has been updated successfully.",
        })

        return true
      } catch (error) {
        toast.error("Operation failed", {
          description: "Failed to increase fund goal",
        })
        console.error("Failed to increase fund goal", error)
        throw error
      }
    },
    [currentFundPool?.id], // Updated dependency to use currentFundPool
  )

  const handleCloseFundPool = useCallback(
    async () => {
      // Check if currentFundPool exists and has an id
      if (!currentFundPool?.id) {
        toast.error("Operation failed", {
          description: "No fund pool found to close.",
        })
        return false
      }

      try {
        const updateData: Partial<FundPool> = {
          status: 'completed'
        }

        const newFundPool = await updateFundPool(currentFundPool.id, updateData)

        // Filter open investments
        const investmentsToUpdate = investments.filter(
          (investment) =>
            investment.status === "needs_action" || investment.status === "pending",
        )

        // Update each investment to 'inactive' status
        const investmentUpdatePromises = investmentsToUpdate.map((investment) =>
          updateInvestment(investment.id, { status: "inactive" }),
        )

        // Wait for all investment updates to complete
        await Promise.all(investmentUpdatePromises)

        // Update the local state with the new data
        setCurrentFundPool((prev) => ({
          ...prev,
          ...newFundPool,
        }))

        toast.success("Success!", {
          description: "Your fund pool has been closed successfully.",
        })

        return true
      } catch (error) {
        toast.error("Operation failed", {
          description: "Failed to close fund pool.",
        })
        console.error("Failed to close fund pool:", error)
        throw error
      }
    },
    [currentFundPool?.id], // Updated dependency to use currentFundPool
  )

  const viewProps = {
    startup,
    industries,
    openfundPool: currentFundPool,
    fundPools,
    investments,
    onCreateFundPool: handleCreateFundPool,
    onIncreaseFundGoal: handleInceaseFundGoal,
    onCloseFundPool: handleCloseFundPool,
  }

  return (
    <>
      {/* Mobile View - Hidden on desktop */}
      <div className="lg:hidden">
        <ViewStartupMobile {...viewProps} />
      </div>
      {/* Desktop View - Hidden on mobile */}
      <div className="hidden lg:block">
        <ViewStartupDesktop {...viewProps} />
      </div>
    </>
  )
}