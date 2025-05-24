"use client"

import { ArrowLeft, Building2, Calendar, FileText, Heart, Loader, MailIcon, MapPinIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FundPool } from "@/types/fund-pool"
import type { Startup } from "@/types/startup"
import { useCallback, useEffect, useState } from "react"
import ViewFundPool from "@/app/(dashboard)/search/[startupId]/(components)/view-fund-pool"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { createFavorite, deleteFavorite } from "@/app/(dashboard)/search/[startupId]/actions"
import { Favorite } from "@/types/favorite"

interface StartupSheetProps {
  startup: Startup
  onBack: () => void
}

export default function StartupSheet({
  startup,
  onBack,
}: StartupSheetProps) {
  const [activeTab, setActiveTab] = useState("pitch-deck")
  const [profileId, setProfileId] = useState<string>("")
  const [industries, setIndustries] = useState<string[] | []>([])
  const [fundPool, setFundPool] = useState<FundPool | null>(null)
  const [favorite, setFavorite] = useState<Partial<Favorite> | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [following, setFollowing] = useState<boolean>(false)

  // Fetch user data for profile id
  // Fetch industry and fund pool data if not provided through props
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
          .select()
          .eq("startup_id", startup.id)

        if (industryErr) {
          console.error("Error fetching industries:", industryErr)
          // return notFound();
        } else {
          setIndustries(industryData.map((industry) => industry.name))
        }

        const { data: favoriteData, error: favoriteErr } = await supabase
          .from("favorites")
          .select("id")
          .eq("startup_id", startup.id)
          .eq("profile_id", user.id)
          .maybeSingle();

        if (favoriteErr) {
          console.error("Error checking if startup is favorited:", favoriteErr);
          // return notFound();
        } else {
          setFavorite(favoriteData)
          setFollowing(!!favoriteData)
        }

        const { data: fundPoolData, error: fundPoolErr } = await supabase
          .from("fund_pools")
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

    loadData()
  }, [startup.id])

  const handleFollowClick = useCallback(async () => {
    try {
      const favoriteData = {
        startup_id: startup.id,
        profile_id: profileId,
      }

      if (!favorite) {
        const newFavorite = await createFavorite(favoriteData)
        setFavorite(newFavorite);
      } else {
        await deleteFavorite(favorite.id!)
        setFavorite(null);
      }

      // Toggle the following state
      setFollowing((prev) => !prev)

      toast.success(`${following ? "Unfollowed" : "Following"} ${startup.name}`, {
        description: following ? "Removed from your followed startups" : "Added to your followed startups",
      })
      return true
    } catch (error) {
      toast.error("Operation failed", {
        description: "Failed to follow startup.",
      })
      console.error("Failed to follow startup:", error)
      throw error
    }
  }, [following, startup.id, startup.name, profileId])

  const handleJoinFundPool = useCallback(
    async (amount: number) => {
      try {
        const investmentData = {
          startup_id: startup.id,
          investment: amount,
        }

        // TODO: make sure this is an investor only action
        // TODO: create investment, email, and notification
        console.log(investmentData)

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
    [startup.id],
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    )
  }

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
      <div className="container mx-auto py-8 px-6">
        {/* TODO: only show button to investors */}
        <div className="relative">
          <button
            onClick={handleFollowClick}
            className="absolute right-0 top-0 p-2"
            aria-label={following ? "Unfollow startup" : "Follow startup"}
          >
            <Heart
              className={`h-6 w-6 transition-colors ${following ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-600"}`}
            />
          </button>
        </div>
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
              <ViewFundPool fundPool={fundPool} onJoinFundPool={handleJoinFundPool} />

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