import type { Startup } from "@/types/startup"
import { MapPinIcon, MailIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CompanyViewProps {
  startup: Startup
}

export default function CompanyView({ startup }: CompanyViewProps) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">{startup.name}</h1>
            <Badge variant="outline" className="text-sm px-3 py-1 h-auto">
              Founded {startup.year_founded}
            </Badge>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>
              {startup.city}, {startup.state}
            </span>
          </div>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overview */}
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">Overview</h3>
              <p className="text-base leading-relaxed">{startup.overview}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">Contact</h3>
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${startup.email}`} className="text-primary hover:underline">
                  {startup.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}