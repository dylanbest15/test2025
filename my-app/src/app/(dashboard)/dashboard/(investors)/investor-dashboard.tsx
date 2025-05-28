import { FundPool } from "@/types/fund-pool";
import { Investment } from "@/types/investment";
import { Profile } from "@/types/profile";
import { Startup } from "@/types/startup";
import ManageRequests from "@/app/(dashboard)/dashboard/(investors)/(components)/manage-requests";

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
  startup: Startup;
}

interface InvestorDashboardProps {
  investments: JoinedInvestment[] | null
}

export default function InvestorDashboard({ investments }: InvestorDashboardProps) {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Manage Requests Card - Right */}
            <ManageRequests investments={investments} />
          </div>
        </div>
      </div>
    </div>
  )
}