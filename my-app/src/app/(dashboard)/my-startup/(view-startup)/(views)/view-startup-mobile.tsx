"use client"

import { useState } from "react"
import type { Startup } from "@/types/startup"
import type { FundPool } from "@/types/fund-pool"
import { MapPinIcon, MailIcon, FileText, Building2, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FundPoolCard from "@/app/(dashboard)/my-startup/(view-startup)/(components)/fund-pool-card"

interface ViewStartupMobileProps {
  startup: Startup
  industries: string[]
  fundPool: FundPool | null
  onCreateFundPool: (amount: number) => Promise<boolean>
}

export default function ViewStartupMobile({ startup, industries, fundPool, onCreateFundPool }: ViewStartupMobileProps) {
  const [activeTab, setActiveTab] = useState("pitch-deck")

  return (
    <div className="w-screen min-h-screen px-6 py-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Header Section with Logo and Name */}
          <div className="flex items-start gap-4">
            <div className="relative">
              {startup.logo_url ? (
                <div className="h-20 w-20 border-2 border-border overflow-hidden rounded-md flex items-center justify-center">
                  <img
                    src={startup.logo_url || "/placeholder.svg"}
                    alt={`${startup.name || "Company"} logo`}
                    className="object-contain max-h-full max-w-full"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-md border-2 border-border">
                  <Building2 className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* Name and details */}
            <div className="space-y-2 flex-1">
              <h1 className="text-xl font-bold">{startup.name}</h1>
              <div className="flex flex-col text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  <span>
                    {startup.city}, {startup.state}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MailIcon className="h-3 w-3" />
                  <span>{startup.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Founded in {startup.year_founded}</span>
                </div>
              </div>
              {industries && industries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {industries.map((industry, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 h-auto">
                      {industry}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm leading-relaxed">{startup.overview}</p>

          {/* Tabs Section */}
          <Tabs defaultValue="pitch-deck" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
              <TabsTrigger value="ask-founders">Ask The Founders</TabsTrigger>
            </TabsList>

            <TabsContent value="pitch-deck" className="mt-4 space-y-4">
              <FundPoolCard fundPool={fundPool} onCreateFundPool={onCreateFundPool} />

              {/* Pitch Deck Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Deck</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted-foreground/20">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-center text-muted-foreground">Pitch deck coming soon</p>
                  <Badge variant="outline" className="mt-4">
                    PDF
                  </Badge>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ask-founders" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ask The Founders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <p className="text-muted-foreground">
                      This feature is coming soon. You'll be able to ask questions directly to the founders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
