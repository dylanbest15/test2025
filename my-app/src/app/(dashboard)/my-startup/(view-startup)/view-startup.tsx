"use client"

import { useCallback, useState } from "react"
import type { Startup } from "@/types/startup"
import type { FundPool } from "@/types/fund-pool"
import { createFundPool } from "@/app/(dashboard)/my-startup/actions"
import { toast } from "sonner"
import ViewStartupMobile from "@/app/(dashboard)/my-startup/(view-startup)/(views)/view-startup-mobile"
import ViewStartupDesktop from "@/app/(dashboard)/my-startup/(view-startup)/(views)/view-startup-desktop"

interface ViewStartupProps {
  startup: Startup
  industries: string[]
  fundPool: FundPool | null
}

export default function ViewStartup({ startup, industries, fundPool }: ViewStartupProps) {
  const [currentFundPool, setCurrentFundPool] = useState<FundPool | null>(fundPool)

  const handleCreateFundPool = useCallback(
    async (amount: number) => {
      try {
        const fundPoolData = {
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

  const viewProps = {
    startup,
    industries,
    fundPool: currentFundPool,
    onCreateFundPool: handleCreateFundPool
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