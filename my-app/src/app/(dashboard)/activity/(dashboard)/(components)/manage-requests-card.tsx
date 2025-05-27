import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FundPool } from "@/types/fund-pool";
import { Investment } from "@/types/investment";
import { Profile } from "@/types/profile";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useState } from "react";

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
}

interface ManageRequestsCardProps {
  investments: JoinedInvestment[] | null;
}

export default function ManageRequestsCard({ investments }: ManageRequestsCardProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const pendingRequests = 5 // This would come from your data source

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={() => toggleCard("requests")}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Manage Requests</CardTitle>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {expandedCard !== "requests" && (
              <Badge variant="default" className="text-xs bg-blue-500">
                {pendingRequests}
              </Badge>
            )}
            {expandedCard === "requests" ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        <CardDescription>Review and manage pending requests</CardDescription>
      </CardHeader>

      {expandedCard === "requests" && (
        <CardContent className="pt-0">
          <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
            {/* <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      You have {pendingRequests} requests that need your attention.
                    </AlertDescription>
                  </Alert> */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Budget Request - Marketing Team</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Equipment Purchase - IT Department</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Travel Expense - Sales Team</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
            <Button className="w-full">View All Requests</Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}