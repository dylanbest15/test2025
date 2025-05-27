"use client"
import type { FundPool } from "@/types/fund-pool"
import type { Startup } from "@/types/startup"
import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { createFavorite, deleteFavorite } from "@/app/(dashboard)/activity/actions"
import type { Favorite } from "@/types/favorite"
import StartupResultMobile from "@/app/(dashboard)/[startupId]/(views)/startup-result-mobile"
import StartupResultDesktop from "@/app/(dashboard)/[startupId]/(views)/startup-result-desktop"
import { createInvestment } from "@/app/(dashboard)/search/actions"
import { Investment } from "@/types/investment"

interface ViewStartupResultProps {
  startup: Startup
  industries: string[]
  fundPool: FundPool | null
  investment: Investment | null
  favorite: Partial<Favorite> | null
}

export default function ViewStartupResult({
  startup,
  industries: industriesProp,
  fundPool: fundPoolProp,
  investment: investmentProp,
  favorite: favoriteProp,
}: ViewStartupResultProps) {
  const [profileId, setProfileId] = useState<string>("")
  const [industries, setIndustries] = useState<string[]>(industriesProp)
  const [fundPool, setFundPool] = useState<FundPool | null>(fundPoolProp)
  const [favorite, setFavorite] = useState<Partial<Favorite> | null>(favoriteProp)
  const [existingInvestment, setExistingInvestment] = useState<Investment | null>(investmentProp)
  const [isLoading, setIsLoading] = useState(true)
  const [following, setFollowing] = useState(favoriteProp ? true : false)

  // Fetch user data for profile id
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
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [startup.id, industriesProp, favoriteProp, fundPoolProp])

  const handleFollowClick = useCallback(async () => {
    try {
      const favoriteData = {
        startup_id: startup.id,
        profile_id: profileId,
      }

      if (!favorite) {
        const newFavorite = await createFavorite(favoriteData)
        setFavorite(newFavorite)
      } else {
        await deleteFavorite(favorite.id!)
        setFavorite(null)
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
  }, [following, startup.id, startup.name, profileId, favorite])

  const handleJoinFundPool = useCallback(
    async (amount: number) => {
      try {
        if (!fundPool) {
          toast.error("Operation failed", {
            description: "Fund pool not available.",
          })
          return false;
        }

        const investmentData = {
          amount,
          fund_pool_id: fundPool.id,
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
    [startup.id, fundPool, profileId],
  )

  const viewProps = {
    startup,
    industries,
    fundPool,
    existingInvestment,
    following,
    onFollowClick: handleFollowClick,
    onJoinFundPool: handleJoinFundPool,
  }

  return (
    <>
      {/* Mobile View - Hidden on desktop */}
      <div className="lg:hidden">
        <StartupResultMobile {...viewProps} />
      </div>

      {/* Desktop View - Hidden on mobile */}
      <div className="hidden lg:block">
        <StartupResultDesktop {...viewProps} />
      </div>
    </>
  )
}
