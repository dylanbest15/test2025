import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Startup } from "@/types/startup";

interface ProgressCardProps {
  startup: Startup;
}

export default function ProgressCard({ startup }: ProgressCardProps) {
  const progressPercentage = Math.min(100, Math.round((startup.fundPool / startup.fundGoal) * 100))

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{startup.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{startup.location}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2 bg-gray-200" />
          <div className="flex justify-between text-sm">
            <span>
              <span className="font-medium">{formatCurrency(startup.fundPool)}</span> raised
            </span>
            <span className="text-muted-foreground">
              Goal: <span className="font-medium">{formatCurrency(startup.fundGoal)}</span>
            </span>
          </div>
          <p className="text-sm font-medium text-green-600">{progressPercentage}% funded</p>
        </div>
      </CardContent>
    </Card>
  )
}