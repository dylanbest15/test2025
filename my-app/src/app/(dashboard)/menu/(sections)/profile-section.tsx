'use client'

import { displayName, getInitials, Profile } from "@/types/profile";
import { useCallback, useState } from "react";
import { updateProfileIndustries, updateProfile } from "@/app/(dashboard)/menu/actions";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import ProfileNameAndBio from "@/app/(dashboard)/menu/(components)/(profile)/profile-name-and-bio";
import ProfilePicture from "@/app/(dashboard)/menu/(components)/(profile)/profile-picture";
import { ChevronRight, Pencil, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Industries from "@/app/(dashboard)/menu/(components)/industries";

interface ProfileSectionProps {
  profile: Profile;
  industries: string[];
}

type SheetType =
  | "name-and-bio"
  | "profile-picture"
  | "industries"
  | null

export default function ProfileSection({ profile, industries }: ProfileSectionProps) {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)
  const [currentProfile, setCurrentProfile] = useState<Profile>(profile)
  const [currentIndustries, setCurrentIndustries] = useState<string[]>(industries)

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

  const handleUpdateIndustries = useCallback(
    async(industryData: string[]) => {
      try {
        // Call the server action to update the database
        await updateProfileIndustries(currentProfile.id, industryData)

        // Update the local state with the new data
        setCurrentIndustries(industryData);
        
        return true
      } catch (error) {
        console.error("Failed to update profile:", error)
        throw error
      }
    },
    [currentProfile.id]
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
                  <AvatarImage src={currentProfile.avatar_url || "/placeholder.svg"} alt={displayName(currentProfile)} className="object-cover" />
                  <AvatarFallback className="text-lg">{getInitials(currentProfile)}</AvatarFallback>
                </Avatar>
                <div
                  className="absolute -top-1 -right-1 bg-background rounded-full p-1 border shadow-sm cursor-pointer"
                  onClick={() => setActiveSheet("profile-picture")}
                >
                  <Pencil size={14} />
                </div>
              </div>
              <p className="font-medium">{displayName(currentProfile)}</p>
            </div>
            <div className="mt-4">

              {/* Name, Title(founder), & Bio */}
              <button
                onClick={() => setActiveSheet("name-and-bio")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Name{profile.type === "founder" && ( ', Title,' )} and Bio</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Investor Industries */}
              {profile.type === "investor" && (
                <button
                  onClick={() => setActiveSheet("industries")}
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
          <ProfilePicture profile={currentProfile} updateProfile={handleUpdateProfile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "industries"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>
          <Industries initialIndustries={currentIndustries} updateIndustries={handleUpdateIndustries} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>
    </div>
  )

}