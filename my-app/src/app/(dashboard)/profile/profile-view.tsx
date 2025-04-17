"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { ProfileEdit } from "@/app/(dashboard)/profile/profile-edit"
import type { Profile } from "@/types/profile"
import { ProfileBadge } from "@/components/custom/profile-badge"

interface ProfileViewProps {
  profile: Profile
}

export default function ProfileView({ profile }: ProfileViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileData, setProfileData] = useState(profile)

  const handleUpdateProfile = (updatedProfile: typeof profile) => {
    setProfileData(updatedProfile)
    setSidebarOpen(false)
  }

  // Helper function to display name
  const displayName = () => {
    const firstName = profileData.first_name?.trim() || ""
    const lastName = profileData.last_name?.trim() || ""
    return `${firstName} ${lastName}`.trim()
  }

  // Helper function to get initials for avatar
  const getInitials = () => {
    const firstName = profileData.first_name?.trim() || ""
    const lastName = profileData.last_name?.trim() || ""

    if (!firstName && !lastName) return "?"

    const firstInitial = firstName ? firstName[0].toUpperCase() : ""
    const lastInitial = lastName ? lastName[0].toUpperCase() : ""

    return `${firstInitial}${lastInitial}`
  }

  return (
    <div className="container mx-auto p-2">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <ProfileBadge
          className="px-4 py-1.5 text-base font-medium"
          variant={profileData.type === "founder" ? "default" : "success"}
        >
          {profileData.type.charAt(0).toUpperCase() + profileData.type.slice(1)}
        </ProfileBadge>
      </div>

      <Card className="w-full mb-10">
        <CardContent className="space-y-6 pt-2">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileData.avatar_url || "/placeholder.svg"} alt={displayName()} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{displayName()}</h3>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
            </div>
          </div>
          <hr />
          <div className="pt-2">
            <p className="text-sm leading-relaxed">{profileData.bio}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end w-full">
        <Button onClick={() => setSidebarOpen(true)} size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <ProfileEdit
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        profile={profileData}
        onUpdate={handleUpdateProfile}
      />
    </div>
  )
}
