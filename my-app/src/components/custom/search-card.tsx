import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { mockStartup } from "@/types/startup";
import Link from "next/link";

interface StartupProps {
  startup: mockStartup;
}

export function SearchCard({ startup }: StartupProps) {
  return (
    <Link href={`/${startup.id}`} className="block">
      <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
        <CardContent>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{startup.name}</h3>
              <p className="text-sm text-gray-500">{startup.location}</p>
            </div>
            <div className="text-green-600 font-medium">
              {formatCurrency(startup.fundPool)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}