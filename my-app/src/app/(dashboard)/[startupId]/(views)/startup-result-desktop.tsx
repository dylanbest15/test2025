"use client"

import { Building2, Calendar, FileText, Heart, MailIcon, MapPinIcon, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FundPool } from "@/types/fund-pool"
import type { Startup } from "@/types/startup"
import ViewFundPool from "@/app/(dashboard)/[startupId]/(components)/view-fund-pool"
import { Investment } from "@/types/investment"

interface StartupResultDesktopProps {
  startup: Startup
  industries: string[]
  fundPool: FundPool | null
  investments: Investment[] | []
  existingInvestment: Investment | null
  following: boolean
  onFollowClick: () => Promise<boolean>
  onJoinFundPool: (amount: number) => Promise<boolean>
}

export default function StartupResultDesktop({
  startup,
  industries,
  fundPool,
  investments,
  existingInvestment,
  following,
  onFollowClick,
  onJoinFundPool,
}: StartupResultDesktopProps) {
  return (
    <div className="min-h-screen bg-background flex">

      {/* Left Sidebar */}
      <div className="w-80 border-r bg-muted/30 p-6 space-y-6">

        {/* Logo Section */}
        <div className="flex justify-center">
          {startup.logo_url ? (
            <div className="h-24 w-24 border-2 border-border overflow-hidden rounded-md flex items-center justify-center">
              <img
                src={startup.logo_url || "/placeholder.svg"}
                alt={`${startup.name || "Company"} logo`}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          ) : (
            <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded-md border-2 border-border">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Founder Bios Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Founder Bios</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor={`founder-${index}`} className="text-xs text-muted-foreground">
                    Name
                  </Label>
                </div>
                <Input id={`founder-${index}`} placeholder="Founder name" className="h-8 text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Follow Button */}
          <div className="flex justify-end">
            <button
              onClick={onFollowClick}
              className="p-2"
              aria-label={following ? "Unfollow startup" : "Follow startup"}
            >
              <Heart
                className={`h-6 w-6 transition-colors ${
                  following ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Header Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{startup.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {industries &&
                    industries.length > 0 &&
                    industries.map((industry, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  <span>{startup.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>
                    {startup.city}, {startup.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Founded in {startup.year_founded}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Overview:</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{startup.overview}</p>
            </div>
          </div>

          {/* Fund Pool */}
          <ViewFundPool fundPool={fundPool} investments={investments} existingInvestment={existingInvestment} onJoinFundPool={onJoinFundPool} />

          {/* Two Column Content */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* Pitch Deck */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Deck</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted-foreground/20 min-h-[400px]">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-center text-muted-foreground">Pitch deck coming soon</p>
                  <Badge variant="outline" className="mt-4">
                    PDF or PPT
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Ask The Founders */}
            <div className="col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Ask The Founders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-4">Post a comment or question and hear directly from the team</p>
                  </div>

                  {/* Sample conversation items */}
                  <div className="space-y-3">
                    <div className="flex gap-2 text-xs">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">Love the idea. Curious to know the timeline on a product?</p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        F
                      </div>
                      <div>
                        <p>We plan on...</p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">What is the expected lifespan of the product?</p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        F
                      </div>
                      <div>
                        <p>The product...</p>
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">What are the most urgent needs for which the needs funds?</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Input placeholder="Type here to post" className="text-xs" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}