"use client"

import type { Startup } from "@/types/startup"
import { MapPinIcon, MailIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { CompanyEdit } from "./company-edit"

interface CompanyViewProps {
  startup: Startup
}

export default function CompanyView({ startup }: CompanyViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [startupData, setStartupData] = useState(startup)

  const handleUpdateStartup = (updatedStartup: typeof startup) => {
    setStartupData(updatedStartup)
    setSidebarOpen(false)
  }

  return (
    <div className="container mx-auto py-8 px-6 max-w-5xl">
      <div className="space-y-8 mb-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">{startupData.name}</h1>
            <Badge variant="outline" className="text-sm px-3 py-1 h-auto">
              Founded {startupData.year_founded}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>
                {startupData.city}, {startupData.state}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MailIcon className="h-4 w-4 mr-2" />
              <span>
                {startupData.email}
              </span>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed">{startupData.overview}</p>
          </CardContent>
        </Card>
      </div>

      {/* {profile.startup_role === 'admin' && (
        <div className="flex justify-end w-full">
          <Button onClick={() => setSidebarOpen(true)} size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Company Details
          </Button>
        </div>
      )} */}

      <CompanyEdit
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        startup={startupData}
        onUpdate={handleUpdateStartup}
      />
    </div>
  )
}
