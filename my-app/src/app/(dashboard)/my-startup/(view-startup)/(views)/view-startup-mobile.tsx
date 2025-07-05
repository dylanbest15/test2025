"use client"

import { useState } from "react"
import type { Startup } from "@/types/startup"
import type { FundPool } from "@/types/fund-pool"
import { MapPinIcon, MailIcon, FileText, Building2, Calendar, QrCode } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FundPoolCard from "@/app/(dashboard)/my-startup/(view-startup)/(components)/fund-pool-card"
import type { Investment } from "@/types/investment"
import QRCodeDialog from "@/app/(dashboard)/my-startup/(view-startup)/(components)/qr-code-dialog"

interface ViewStartupMobileProps {
  startup: Startup
  industries: string[]
  openfundPool: FundPool | null
  fundPools: FundPool[] | []
  investments: Investment[] | []
  onCreateFundPool: (amount: number) => Promise<boolean>
  onIncreaseFundGoal: (amount: number) => Promise<boolean>
  onCloseFundPool: () => Promise<boolean>
}

export default function ViewStartupMobile({
  startup,
  industries,
  openfundPool,
  fundPools,
  investments,
  onCreateFundPool,
  onIncreaseFundGoal,
  onCloseFundPool,
}: ViewStartupMobileProps) {
  const [activeTab, setActiveTab] = useState("pitch-deck")
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  // Generate the QR code URL using base URL + startup ID
  const getQRCodeUrl = () => {
    if (typeof window !== "undefined") {
      const baseUrl = `${window.location.protocol}//${window.location.host}`
      return `${baseUrl}/${startup.id}`
    }
    return ""
  }

  return (
    <div className="w-screen min-h-screen px-4 py-6 mb-20 bg-[#f8f9fa]">
      <div className="w-full max-w-5xl mx-auto">
        <div className="space-y-2 mt-6">
            {/* QR Code Button - Top Right */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQrDialogOpen(true)}
              className="absolute top-2 right-2 text-sm"
            >
              <QrCode className="h-5 w-5" />
              Share QR Code
            </Button>
          {/* Header Section with Logo and Name */}
          <div className="flex items-start gap-4 bg-white p-4 relative">

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
            <div className="space-y-2 flex-1 pr-16">
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

          {/* Overview section with See More */}
          <div className="bg-white p-4">
            <h2 className="font-semibold text-gray-900 pb-1">Overview</h2>
            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <p className="text-sm leading-relaxed">
                {isOverviewExpanded
                  ? startup.overview
                  : startup.overview && startup.overview.length > 75
                    ? startup.overview.substring(0, 75)
                    : startup.overview}
                {startup.overview && startup.overview.length > 75 && (
                  <>
                    {!isOverviewExpanded && "..."}
                    <button
                      onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                      className="ml-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors inline"
                    >
                      {isOverviewExpanded ? " See Less" : " See More"}
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Fund Pool Card */}
          <FundPoolCard
            openFundPool={openfundPool}
            fundPools={fundPools}
            investments={investments}
            onCreateFundPool={onCreateFundPool}
            onIncreaseFundGoal={onIncreaseFundGoal}
            onCloseFundPool={onCloseFundPool}
          />

          {/* Tabs Section */}
          <Tabs defaultValue="pitch-deck" className="w-full mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
              <TabsTrigger value="ask-founders">Ask The Founders</TabsTrigger>
            </TabsList>
            <TabsContent value="pitch-deck" className="mt-2">
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
            <TabsContent value="ask-founders" className="mt-2">
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

      {/* QR Code Dialog */}
      <QRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        url={getQRCodeUrl()}
        startupName={startup.name}
      />
    </div>
  )
}