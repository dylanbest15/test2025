"use client"

import type React from "react"
import { ArrowLeft, Building2, Calendar, FileText, Heart, Loader, MailIcon, MapPinIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FundPool } from "@/types/fund-pool"
import type { Startup } from "@/types/startup"
import { useCallback, useEffect, useState } from "react"
import ViewFundPool from "@/app/(dashboard)/[startupId]/(components)/view-fund-pool"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { createInvestment } from "@/app/(dashboard)/search-startups/actions"
import { Investment } from "@/types/investment"

interface StartupSheetProps {
  startup: Startup
  following: boolean
  onFollowClick: (e: React.MouseEvent) => Promise<boolean>
  onBack: () => void
}

export default function StartupSheet({ startup, following, onFollowClick, onBack }: StartupSheetProps) {
  const [activeTab, setActiveTab] = useState("pitch-deck")
  const [profileId, setProfileId] = useState<string>("")
  const [industries, setIndustries] = useState<string[] | []>([])
  const [openFundPool, setOpenFundPool] = useState<FundPool | null>(null)
  const [fundPools, setFundPools] = useState<FundPool[] | []>([])
  const [investments, setInvestments] = useState<Investment[] | []>([])
  const [existingInvestment, setExistingInvestment] = useState<Investment | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const supabase = await createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setProfileId(user.id)
        } else {
          return redirect("/")
        }

        const { data: industryData, error: industryErr } = await supabase
          .from("industries")
          .select("*")
          .eq("startup_id", startup.id)

        if (industryErr) {
          console.error("Error fetching industries:", industryErr)
          // return notFound();
        } else {
          setIndustries(industryData.map((industry) => industry.name))
        }

        const { data: fundPoolData, error: fundPoolErr } = await supabase
          .from("fund_pools")
          .select("*")
          .eq("startup_id", startup.id)

        if (fundPoolErr) {
          console.error("Error fetching fund pool:", fundPoolErr)
        } else {
          setFundPools(fundPoolData)

          if (fundPoolData && fundPoolData.length > 0) {
            const openFundPool = fundPoolData.find((pool) => pool.status === "open") || null
            setOpenFundPool(openFundPool)

            if (openFundPool && user) {
              const { data: investmentData, error: investmentsErr } = await supabase
                .from("investments")
                .select("*")
                .eq("fund_pool_id", openFundPool.id)
                .in("status", ["needs_action", "pending", "confirmed"])
  
              if (investmentsErr) {
                console.error("Error fetching investments:", investmentsErr)
              } else {
                // Find the existing investment
                const userInvestment = investmentData.find(inv => inv.profile_id === user.id)
                setExistingInvestment(userInvestment || null)
  
                // Store all investments for display/calculations
                setInvestments(investmentData)
              }
            }
          }

        }
      } catch (error) {
        console.error("Failed to fetch fund pools:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [startup.id])

  const handleFollowClick = useCallback(
    async (e: React.MouseEvent) => {
      return await onFollowClick(e)
    },
    [onFollowClick],
  )

  const handleJoinFundPool = useCallback(
    async (amount: number) => {
      try {
        if (!openFundPool) {
          toast.error("Operation failed", {
            description: "Fund pool not available.",
          })
          return false;
        }

        const investmentData = {
          amount,
          fund_pool_id: openFundPool.id,
          startup_id: startup.id,
          profile_id: profileId
        }

        // TODO: make sure this is an investor only action
        const newInvestment = await createInvestment(investmentData);
        setExistingInvestment(newInvestment);

        toast.success("Success!", {
          description: "You have requested to join a fund pool!",
        })
        return true
      } catch (error) {
        toast.error("Operation failed", {
          description: "Failed to join fund pool.",
        })
        console.error("Failed to join fund pool:", error)
        throw error
      }
    },
    [startup.id, openFundPool, profileId],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-[#f8f9fa]">
      {onBack && (
        <div className="top-0 z-10 pt-4 pl-4">
          <button
            onClick={onBack}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search
          </button>
        </div>
      )}
      <div className="container mx-auto py-4 px-4">
        {/* TODO: only show button to investors */}
        <div className="relative">
          <button
            onClick={handleFollowClick}
            className="absolute right-0 top-0 p-2"
            aria-label={following ? "Unfollow startup" : "Follow startup"}
          >
            <Heart
              className={`h-6 w-6 stroke-gray-300 transition-colors ${following ? "fill-red-500" : "fill-white"}`}
            />
          </button>
        </div>
        <div className="space-y-2">
          {/* Header Section with Logo and Name */}
          <div className="flex items-start gap-4 bg-white p-4">
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
          <ViewFundPool fundPool={openFundPool} investments={investments} existingInvestment={existingInvestment} onJoinFundPool={handleJoinFundPool} />

          {/* Tabs Section */}
          <Tabs defaultValue="pitch-deck" className="w-full mt-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="pitch-deck">Pitch Deck</TabsTrigger>
              <TabsTrigger value="ask-founders">Ask The Founders</TabsTrigger>
            </TabsList>

            <TabsContent value="pitch-deck" className="mt-1">
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

            <TabsContent value="ask-founders" className="mt-1">
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