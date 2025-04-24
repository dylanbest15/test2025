"use client"

import { signOutAction } from "@/app/actions"
import InvestorIndustries from "@/components/custom/menu-sheets/investor-industries"
import ProfileNameAndBio from "@/components/custom/menu-sheets/profile-name-and-bio"
import ProfilePicture from "@/components/custom/menu-sheets/profile-picture"
import StartupLogo from "@/components/custom/menu-sheets/startup-logo"
import StartupOverview from "@/components/custom/menu-sheets/startup-overview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import type { Profile } from "@/types/profile"
import type { Startup } from "@/types/startup"
import { Building2, ChevronRight, HelpCircle, LogOut, MapPin, Settings, Sun, User } from "lucide-react"
import { useState, useTransition } from "react"
import StartupGeneralInfo from "@/components/custom/menu-sheets/startup-general-info"
import StartupManageTeam from "@/components/custom/menu-sheets/startup-manage-team"
import SettingsAccount from "@/components/custom/menu-sheets/settings-account"
import SettingsNotifications from "@/components/custom/menu-sheets/settings-notifications"

interface MenuViewProps {
  profile: Profile
  startup?: Startup
}

type SheetType =
  | "name-and-bio"
  | "profile-picture"
  | "investor-industries"
  | "general-info"
  | "overview"
  | "logo"
  | "manage-team"
  | "account"
  | "notifications"
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
            <div className="mt-8 flex flex-col items-center w-full mb-6">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={displayName()} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{displayName()}</p>
            </div>
            <div className="mt-4">

              {/* Name, Title(founder), & Bio */}
              <button
                onClick={() => setActiveSheet("name-and-bio")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Name, Title, and Bio</p>
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

          {/* Startup (admin) Section */}
          {startup && profile.startup_role === "admin" && (
            <div className="w-full mt-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Building2 size={18} />
                  My Startup
                </h2>
                {profile.startup_role && <Badge variant="secondary">{profile.startup_role}</Badge>}
              </div>
              <div className="mt-4">

                {/* General Info */}
                <button
                  onClick={() => setActiveSheet("general-info")}
                  className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                  disabled={profile.startup_role !== "admin"}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">General Info</p>
                  </div>
                  <ChevronRight size={16} />
                </button>

                {/* Overview */}
                <button
                  onClick={() => setActiveSheet("overview")}
                  className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                  disabled={profile.startup_role !== "admin"}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">Overview</p>
                  </div>
                  <ChevronRight size={16} />
                </button>

                {/* Logo */}
                <button
                  onClick={() => setActiveSheet("logo")}
                  className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                  disabled={profile.startup_role !== "admin"}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">Logo</p>
                  </div>
                  <ChevronRight size={16} />
                </button>

                {/* Manage Team */}
                <button
                  onClick={() => setActiveSheet("manage-team")}
                  className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
                  disabled={profile.startup_role !== "admin"}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">Manage Team</p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Settings Section */}
          <div className="w-full mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Settings size={18} />
                Settings
              </h2>
            </div>
            <div className="mt-4">

              {/* Account */}
              <button
                onClick={() => setActiveSheet("account")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Account</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Notifications */}
              <button
                onClick={() => setActiveSheet("notifications")}
                className="flex items-center justify-between w-full py-3 border-b hover:bg-muted/50 px-2 rounded-sm"
              >
                <div className="text-left">
                  <p className="text-sm font-medium">Notifications</p>
                </div>
                <ChevronRight size={16} />
              </button>

              {/* Dark Mode */}
              <button
                className="flex items-center w-full py-3 gap-2 border-b hover:bg-muted/50 px-2 rounded-sm"
                disabled={profile.startup_role !== "admin"}
              >
                <Sun size={18} />
                <p className="text-sm font-medium">Dark Mode</p>
              </button>

              {/* Help Center */}
              <button
                className="flex items-center w-full py-3 gap-2 border-b hover:bg-muted/50 px-2 rounded-sm"
                disabled={profile.startup_role !== "admin"}
              >
                <HelpCircle size={18} />
                <p className="text-sm font-medium">Help Center</p>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-3 gap-2 border-b text-destructive hover:bg-muted/50 px-2 rounded-sm"
                disabled={isPending}
              >
                <LogOut size={18} />
                <p className="text-sm font-medium">{isPending ? "Logging out..." : "Logout"}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sheets */}
      <Sheet open={activeSheet === "name-and-bio"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Personal Information</SheetTitle>
          <ProfileNameAndBio profile={profile} onClose={() => setActiveSheet(null)} />
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
      <Sheet open={activeSheet === "general-info"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>General Info</SheetTitle>
          <StartupGeneralInfo startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "overview"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Overview</SheetTitle>
          <StartupOverview startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "logo"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Logo</SheetTitle>
          <StartupLogo startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "manage-team"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Manage Team</SheetTitle>
          <StartupManageTeam startup={startup} onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      {/* Settings Sheets */}
      <Sheet open={activeSheet === "account"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Account</SheetTitle>
          <SettingsAccount onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>

      <Sheet open={activeSheet === "notifications"} onOpenChange={() => setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-full p-0" aria-describedby={undefined}>
          <SheetTitle>Notifications</SheetTitle>
          <SettingsNotifications onClose={() => setActiveSheet(null)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}