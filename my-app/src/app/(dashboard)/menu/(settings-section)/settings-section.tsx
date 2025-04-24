'use client'

import { signOutAction } from "@/app/actions"
import SettingsAccount from "@/components/custom/menu-sheets/settings-account"
import SettingsNotifications from "@/components/custom/menu-sheets/settings-notifications"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ChevronRight, HelpCircle, LogOut, Settings, Sun } from "lucide-react"
import { useState, useTransition } from "react"

type SheetType =
  | "account"
  | "notifications"
  | null

export default function SettingsSection() {
  const [isPending, startTransition] = useTransition()
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">

          {/* Settings Section */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Settings size={18} />
                Settings
              </h2>
            </div>
            <div className="mt-4">

              {/* Account */}
              <button
                onClick={() => setActiveSheet("account")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Account</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Notifications */}
              <button
                onClick={() => setActiveSheet("notifications")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Notifications</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Dark Mode */}
              <button
                className="flex items-center w-full py-3 gap-2 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <Sun size={18} />
                <p className="text-sm font-medium">Dark Mode</p>
              </button>

              {/* Help Center */}
              <button
                className="flex items-center w-full py-3 gap-2 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <HelpCircle size={18} />
                <p className="text-sm font-medium">Help Center</p>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-3 gap-2 border-b text-destructive hover:bg-muted/50 px-2 rounded-sm"
                disabled={isPending}
              >
                <LogOut size={18} />
                <p className="text-sm font-medium">{isPending ? "Logging out..." : "Logout"}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sheets */}
      <Sheet open={activeSheet === "account"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <SettingsAccount onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "notifications"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <SettingsNotifications onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}