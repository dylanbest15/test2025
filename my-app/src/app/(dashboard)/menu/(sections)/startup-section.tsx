'use client'

import { Startup } from "@/types/startup";
import { useCallback, useState } from "react";
import { updateStartupIndustries, updateStartup } from "@/app/(dashboard)/menu/actions";
import { Building2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import StartupGeneralInfo from "@/app/(dashboard)/menu/(components)/(startup)/startup-general-info";
import StartupOverview from "@/app/(dashboard)/menu/(components)/(startup)/startup-overview";
import StartupLogo from "@/app/(dashboard)/menu/(components)/(startup)/startup-logo";
import StartupManageTeam from "@/app/(dashboard)/menu/(components)/(startup)/startup-manage-team";
import Industries from "@/app/(dashboard)/menu/(components)/industries";

interface StartupSectionProps {
  startup: Startup;
  industries: string[]
}

type SheetType =
  | "general-info"
  | "overview"
  | "logo"
  | "industries"
  | "manage-team"
  | null

export default function StartupSection({ startup, industries }: StartupSectionProps) {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)
  const [currentStartup, setCurrentStartup] = useState<Startup>(startup)
  const [currentIndustries, setCurrentIndustries] = useState<string[]>(industries)


  const handleUpdateStartup = useCallback(
    async (startupData: Partial<Startup>) => {
      try {
        // Call the server action to update the database
        await updateStartup(currentStartup.id, startupData)

        // Update the local state with the new data
        setCurrentStartup((prev) => ({
          ...prev,
          ...startupData,
        }))

        return true
      } catch (error) {
        console.error("Failed to update startup:", error)
        throw error
      }
    },
    [currentStartup.id],
  )

  const handleUpdateIndustries = useCallback(
      async(industryData: string[]) => {
        try {
          // Call the server action to update the database
          await updateStartupIndustries(currentStartup.id, industryData)
  
          // Update the local state with the new data
          setCurrentIndustries(industryData);
          
          return true
        } catch (error) {
          console.error("Failed to update profile:", error)
          throw error
        }
      },
      [currentStartup.id]
    )

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">

          {/* Startup (admin) Section */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Building2 size={18} />
                My Startup
              </h2>
              <Badge variant="secondary">admin</Badge>
            </div>
            <div className="mt-4">

              {/* General Info */}
              <button
                onClick={() => setActiveSheet("general-info")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">General Info</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Overview */}
              <button
                onClick={() => setActiveSheet("overview")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Overview</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Logo */}
              <button
                onClick={() => setActiveSheet("logo")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Upload Logo</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Startup Industries */}
              <button
                onClick={() => setActiveSheet("industries")}
                className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Industries</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Manage Team */}
              <button
                onClick={() => setActiveSheet("manage-team")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Manage Team</p>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Startup Sheets */}
      <Sheet open={activeSheet === "general-info"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <StartupGeneralInfo startup={currentStartup} updateStartup={handleUpdateStartup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "overview"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <StartupOverview startup={currentStartup} updateStartup={handleUpdateStartup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "industries"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <Industries initialIndustries={currentIndustries} updateIndustries={handleUpdateIndustries} onClose={() => setActiveSheet(null)} maxSelections={2} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "logo"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <StartupLogo startup={currentStartup} updateStartup={handleUpdateStartup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "manage-team"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <StartupManageTeam startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
