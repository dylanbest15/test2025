"use client"

import { signOutAction } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Profile } from "@/types/profile"
import type { Startup } from "@/types/startup"
import { Building2, HelpCircle, LogOut, MapPin, Pencil, Sun, User } from "lucide-react"
import Link from "next/link"
import { useTransition } from "react"

interface MenuViewProps {
  profile: Profile
  startup?: Startup
}

export default function MenuView({ profile, startup }: MenuViewProps) {
  const [isPending, startTransition] = useTransition()

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
        <div className="space-y-6 p-5 w-full">
          <div className="w-full">
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

            <div className="mt-4 flex items-start w-full gap-4">
              <Avatar className="h-20 w-20 flex-shrink-0">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={displayName()} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium">{displayName()}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <Link
                  href="/edit-profile"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Pencil size={12} />
                  Edit Profile
                </Link>
              </div>
            </div>

            {profile.type === "investor" && (
              <>
                {profile.bio && (
                  <div className="mt-3 text-xs w-full">
                    <Separator className="my-4" />
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="mt-2 mb-2">
                  <Badge
                    variant="outline"
                    className={profile.investor_active ? "border-green-500 text-green-500" : "border-gray-500 text-gray-500"}
                  >
                    {profile.investor_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground p-2">
                    {profile.investor_active ? "You are set to active." : "You are set to inactive."}
                  </span>
                </div>
              </>
            )}
          </div>

          {startup && (
            <>
              <Separator />
              <div className="w-full">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xl font-bold">
                    <Building2 size={18} />
                    My Startup
                  </div>
                  <Badge variant="secondary">{profile.startup_role}</Badge>
                </div>

                <div className="mt-4 flex items-start w-full gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted flex-shrink-0">
                    <Building2 size={36} className="text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium">{startup.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {startup.city}, {startup.state}
                      </p>
                    </div>
                    {profile.startup_role === "admin" && (
                      <Link
                        href="/startup/edit"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={12} />
                        Edit Startup
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border p-4 w-full">
        <a href="#" className="flex items-center gap-2 py-1.5 text-sm hover:text-foreground/80">
          <Sun size={16} />
          Dark Mode
        </a>
        <a href="#" className="flex items-center gap-2 py-1.5 text-sm hover:text-foreground/80">
          <HelpCircle size={16} />
          Help Center
        </a>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-2 py-1.5 text-sm text-destructive hover:text-destructive/80"
        >
          <LogOut size={16} />
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  )
}
