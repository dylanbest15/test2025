"use client"

import { signOutAction } from "@/app/actions"
import InvestorIndustries from "@/components/custom/menu-sheets/investor-industries"
import PersonalInformation from "@/components/custom/menu-sheets/personal-information"
import ProfileBio from "@/components/custom/menu-sheets/profile-bio"
import ProfilePicture from "@/components/custom/menu-sheets/profile-picture"
import SettingsSheet from "@/components/custom/menu-sheets/settings-sheet"
import StartupDetails from "@/components/custom/menu-sheets/startup-details"
import StartupLogo from "@/components/custom/menu-sheets/startup-logo"
import StartupOverview from "@/components/custom/menu-sheets/startup-overview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import type { Profile } from "@/types/profile"
import type { Startup } from "@/types/startup"
import { Building2, ChevronRight, MapPin, Settings, User } from "lucide-react"
import { useState, useTransition } from "react"

interface MenuViewProps {
  profile: Profile
  startup?: Startup
}

type SheetType =
  | "personal-information"
  | "profile-bio"
  | "profile-picture"
  | "investor-industries"
  | "startup-details"
  | "startup-overview"
  | "startup-logo"
  | "settings"
  | null

export default function MenuView({ profile, startup }: MenuViewProps) {
  const [isPending, startTransition] = useTransition()
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  // Helper function to display name
  const displayName = () => {
    const firstName = profile.first_name?.trim() || ""
    const lastName = profile.last_name?.trim() || ""
    return `${firstName} ${lastName}`.trim()
  }

  // Helper function to get initials for avatar
  const getInitials = () => {
    const firstName = profile.first_name?.trim() || ""
    const lastName = profile.last_name?.trim() || ""

    if (!firstName && !lastName) return "?"

    const firstInitial = firstName ? firstName[0].toUpperCase() : ""
    const lastInitial = lastName ? lastName[0].toUpperCase() : ""

    return `${firstInitial}${lastInitial}`
  }

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">
          <div className="w-full">
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
              <button
                onClick={() => setActiveSheet("settings")}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
            </div>
            <div className="mt-4 flex items-start w-full gap-4 mb-6">
              <Avatar className="h-20 w-20 flex-shrink-0">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={displayName()} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium">{displayName()}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <div className="mt-4">
              {/* Personal Information */}
              <button
                onClick={() => setActiveSheet("personal-information")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Personal Information</p>
                  {/* <p className="text-sm text-muted-foreground">Change your name and title</p> */}
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Profile Bio */}
              <button
                onClick={() => setActiveSheet("profile-bio")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">About You</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Profile Picture */}
              <button
                onClick={() => setActiveSheet("profile-picture")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Profile Picture</p>
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
                    <p className="text-sm font-medium">Your Industries</p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
          {startup && (
            <>
              <div className="w-full mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Building2 size={18} />
                    My Startup
                  </h2>
                  {profile.startup_role && <Badge variant="secondary">{profile.startup_role}</Badge>}
                </div>
                <div className="mt-4 flex items-start w-full gap-4 mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted flex-shrink-0">
                    {/* <Building2 size={36} className="text-muted-foreground" /> */}
                    <p>Logo</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium">{startup.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {startup.city}, {startup.state}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  {/* Startup Details */}
                  <button
                    onClick={() => setActiveSheet("startup-details")}
                    className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                    disabled={profile.startup_role !== "admin"}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">Company Details</p>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  {/* Startup Overview */}
                  <button
                    onClick={() => setActiveSheet("startup-overview")}
                    className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                    disabled={profile.startup_role !== "admin"}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">Company Overview</p>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  {/* Startup Logo */}
                  <button
                    onClick={() => setActiveSheet("startup-logo")}
                    className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                    disabled={profile.startup_role !== "admin"}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">Company Logo</p>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Sheets */}
      <Sheet open={activeSheet === "personal-information"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Personal Information</SheetTitle>
          <PersonalInformation profile={profile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "profile-bio"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Profile Bio</SheetTitle>
          <ProfileBio profile={profile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "profile-picture"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Personal Picture</SheetTitle>
          <ProfilePicture profile={profile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "investor-industries"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Investor Industries</SheetTitle>
          <InvestorIndustries profile={profile} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      {/* Startup Sheets */}
      <Sheet open={activeSheet === "startup-details"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Company Details</SheetTitle>
          <StartupDetails startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "startup-overview"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Company Overview</SheetTitle>
          <StartupOverview startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "startup-logo"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Company Logo</SheetTitle>
          <StartupLogo startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      {/* Settings Sheet */}
      <Sheet open={activeSheet === "settings"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Settings</SheetTitle>
          <SettingsSheet onClose={() => setActiveSheet(null)} onLogout={handleLogout} isPending={isPending} />
        </SheetContent>
      </Sheet>
    </div>
  )
}