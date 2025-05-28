import { Button } from "@/components/ui/button"
import { FundPool } from "@/types/fund-pool"
import { Investment } from "@/types/investment"
import { Profile } from "@/types/profile"
import { Startup } from "@/types/startup"
import { ArrowLeft } from "lucide-react"

interface JoinedInvestment extends Investment {
  fund_pool: FundPool
  profile: Profile
  startup: Startup
}

interface PreviousInvestmentsProps {
  investments: JoinedInvestment[] | null
  onClose: () => void
}

export default function PreviousInvestments({ investments, onClose }: PreviousInvestmentsProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-lg font-semibold">Investment History</h2>
      </div>

      {/* Content */}
      <div>
        
      </div>
    </div>
  )
}