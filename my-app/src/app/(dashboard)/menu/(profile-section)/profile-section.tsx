'use client'

import { Profile } from "@/types/profile";
import { useCallback, useState } from "react";
import { updateProfile } from "./actions";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ProfileNameAndBio from "@/components/custom/menu-sheets/profile-name-and-bio";
import ProfilePicture from "@/components/custom/menu-sheets/profile-picture";
import InvestorIndustries from "@/components/custom/menu-sheets/investor-industries";
import { ChevronRight, Pencil, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileSectionProps {
  profile: Profile;
}

type SheetType =
  | "name-and-bio"
  | "profile-picture"
  | "investor-industries"
  | null

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)
  const [currentProfile, setCurrentProfile] = useState<Profile>(profile)

  // Helper function to display name
  const displayName = () => {
    const firstName = currentProfile.first_name?.trim() || ""
    const lastName = currentProfile.last_name?.trim() || ""
    return `${firstName} ${lastName}`.trim()
  }

  // Helper function to get initials for avatar
  const getInitials = () => {
    const firstName = currentProfile.first_name?.trim() || ""
    const lastName = currentProfile.last_name?.trim() || ""

    if (!firstName && !lastName) return "?"

    const firstInitial = firstName ? firstName[0].toUpperCase() : ""
    const lastInitial = lastName ? lastName[0].toUpperCase() : ""

    return `${firstInitial}${lastInitial}`
  }

  const handleUpdateProfile = useCallback(
    async (profileData: Partial<Profile>) => {
      try {
        // Call the server action to update the database
        await updateProfile(currentProfile.id, profileData)

        // Update the local state with the new data
        setCurrentProfile((prev) => ({
          ...prev,
          ...profileData,
        }))

        return true
      } catch (error) {
        console.error("Failed to update profile:", error)
        throw error
      }
    },
    [currentProfile.id],
  )

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">

          {/* Profile Section */}
          <div className="w-full">

            {/* Profile Header */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <User size={18} />
                  My Profile
                </h2>
                {profile.type && (
                  <Badge
                    className={
                      profile.type === "founder"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : profile.type === "investor"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                    }
                  >
                    {profile.type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Profile Display */}
            <div className="mt-8 flex flex-row items-center w-full mb-6">
              <div className="relative mr-4">
                <Avatar className="h-20 w-20 cursor-pointer" onClick={() => setActiveSheet("profile-picture")}>
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={displayName()} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div
                  className="absolute -top-1 -right-1 bg-background rounded-full p-1 border shadow-sm cursor-pointer"
                  onClick={() => setActiveSheet("profile-picture")}
                >
                  <Pencil size={14} />
                </div>
              </div>
              <p className="font-medium">{displayName()}</p>
            </div>
            <div className="mt-4">

              {/* Name, Title(founder), & Bio */}
              <button
                onClick={() => setActiveSheet("name-and-bio")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Name {profile.type === "founder" && ( ', Title,' )} and Bio</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Investor Industries */}
              {profile.type === "investor" && (
                <button
                  onClick={() => setActiveSheet("investor-industries")}
                  className="flex items-center justify-between w-full py-3 hover:bg-muted/50 px-2 rounded-sm"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">Interests and Industries</p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Profile Sheets */}
      <Sheet open={activeSheet === "name-and-bio"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <ProfileNameAndBio profile={currentProfile} updateProfile={handleUpdateProfile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "profile-picture"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <ProfilePicture profile={profile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "investor-industries"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <InvestorIndustries profile={profile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>
    </div>
  )

}