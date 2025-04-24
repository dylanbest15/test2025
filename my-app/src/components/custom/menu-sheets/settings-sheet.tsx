import { Separator } from "@/components/ui/separator"
import { HelpCircle, LogOut, Sun } from "lucide-react"

interface SettingsSheetProps {
  onClose: () => void
  onLogout: () => void
  isPending: boolean
}

export default function SettingsSheet({ onClose, onLogout, isPending }: SettingsSheetProps) {
  return (
    <div className="flex h-full flex-col">
      {/* <div className="flex items-center border-b p-4">
        <h2 className="text-lg font-semibold">Settings</h2>
      </div> */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-2">
          <button className="flex w-full items-center gap-2 py-3 px-4 text-sm hover:bg-muted rounded-md">
            <Sun size={18} />
            Dark Mode
          </button>

          <button className="flex w-full items-center gap-2 py-3 px-4 text-sm hover:bg-muted rounded-md">
            <HelpCircle size={18} />
            Help Center
          </button>

          <Separator className="my-2" />

          <button
            onClick={onLogout}
            disabled={isPending}
            className="flex w-full items-center gap-2 py-3 px-4 text-sm text-destructive hover:bg-destructive/10 rounded-md"
          >
            <LogOut size={18} />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  )
}