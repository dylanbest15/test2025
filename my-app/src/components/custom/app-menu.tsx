"use client"

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Profile } from "@/types/profile"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building2, HelpCircle, LogOut, MapPin, Pencil, Sun, User } from "lucide-react"
import { useEffect, useTransition, type ReactNode } from "react"
import type { Startup } from "@/types/startup"
import Link from "next/link"
import type { Member } from "@/types/member"
import { signOutAction } from "@/app/actions"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface AppMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  member?: Member
  startup?: Startup
  trigger: ReactNode
}

export function AppMenu({ isOpen, onOpenChange, profile, member, startup, trigger }: AppMenuProps) {
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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col overflow-hidden" aria-describedby={undefined}>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col space-y-6 p-5">
            <div className="relative">
              <div className="flex items-center gap-2">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                  <User size={18} />
                  My Profile
                </SheetTitle>
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

              <div className="mt-4 flex flex-col items-center pt-2">
                {/* <div className="h-20 w-20 rounded-full bg-muted mb-4"></div> */}
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={displayName()} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="text-center w-full">
                  <p className="font-medium">{displayName()}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                {profile.type === "investor" && (
                  <>
                    {profile.bio && (
                      <div className="mt-3 text-xs">
                        <Separator className="mb-4" />
                        <p className="text-muted-foreground">{profile.bio}</p>
                      </div>
                    )}
                    <Separator className="mt-4 mb-2"/>
                    <div className="mt-2 mb-2">
                      <Badge
                        variant="outline"
                        className={
                          profile.active ? "border-green-500 text-green-500" : "border-gray-500 text-gray-500"
                        }
                      >
                        {profile.active ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-muted-foreground p-2">
                        {profile.active ? "You are set to active." : "You are set to inactive."}
                      </span>
                    </div>
                  </>
                )}
                <Link
                  href="/edit-profile"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onOpenChange(false)}
                >
                  <Pencil size={12} />
                  Edit Profile
                </Link>
              </div>
            </div>
            {profile.type === "founder" && startup && (
              <>
                <Separator />
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xl font-bold">
                      <Building2 size={18} />
                      My Startup
                    </div>
                    {member?.role && <Badge variant="secondary">{member.role}</Badge>}
                  </div>
                  <div className="mt-4 flex flex-col items-center pt-2">
                    {/* Startup logo on its own row */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted mb-4">
                      <Building2 size={36} className="text-muted-foreground" />
                    </div>
                    {/* Startup details below */}
                    <div className="text-center w-full">
                      <p className="font-medium">{startup.name}</p>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <MapPin size={14} className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {startup.city}, {startup.state}
                        </p>
                      </div>
                      {member && member.role === "admin" && (
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
        <div className="border-t border-border p-4">
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
      </SheetContent>
    </Sheet>
  )
}