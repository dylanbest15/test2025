"use client"

import { ArrowLeft, Building2, Calendar, FileText, MailIcon, MapPinIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FundPool } from "@/types/fund-pool"
import type { Startup } from "@/types/startup"
import { useEffect, useState } from "react"
import ViewFundPool from "./view-fund-pool"
import { createClient } from "@/utils/supabase/client"

interface ViewStartupResultProps {
  startup: Startup
  industries?: string[]
  fundPool?: FundPool
  onBack?: () => void
}

export default function ViewStartupResult({ startup, industries: industriesProp, fundPool: fundPoolProp, onBack }: ViewStartupResultProps) {
  const [activeTab, setActiveTab] = useState("pitch-deck")
  const [industries, setIndustries] = useState<string[] | []>(industriesProp || []);
  const [fundPool, setFundPool] = useState<FundPool | null>(fundPoolProp || null)
  const [isLoading, setIsLoading] = useState(!fundPoolProp)

  // Fetch fund pool data if not provided through props
  useEffect(() => {
    async function loadData() {
      if (!industriesProp || !fundPoolProp) {
        try {
          const supabase = await createClient()
          setIsLoading(true)

          const { data: industryData, error: industryErr } = await supabase.from("industries")
            .select()
            .eq("startup_id", startup.id)

          if (industryErr) {
            console.error("Error fetching industries:", industryErr);
            // return notFound();
          } else {
            setIndustries(industryData.map(industry => industry.name));
          }

          const { data: fundPoolData, error: fundPoolErr } = await supabase.from("fund_pools")
            .select()
            .eq("startup_id", startup.id)
            .single()

          // ignore PGRST116 error (no fund pool exists)
          if (fundPoolErr && fundPoolErr.code !== "PGRST116") {
            console.error("Error fetching fund pool:", fundPoolErr)
          } else {
            setFundPool(fundPoolData)
          }
        } catch (error) {
          console.error("Failed to fetch fund pool:", error)
          setFundPool(null)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadData()
  }, [startup.id, industriesProp, fundPoolProp])

  return (
    <div className="h-full overflow-auto">
      {onBack && (
        <div className="top-0 z-10 pt-4 pl-4 bg-background">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </button>
        </div>
      )}
      <div className="container mx-auto py-8 px-6 max-w-5xl">
        <div className="space-y-6">
          {/* Header Section with Logo and Name */}
          <div className="flex items-start gap-4">
            {/* Larger square logo with icon */}
            <div className="h-20 w-20 bg-gray-100 flex flex-shrink-0 items-center justify-center rounded-md">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>

            {/* Name and details */}
            <div className="space-y-2">
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
              <ViewFundPool fundPool={fundPool} />

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