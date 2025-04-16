"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

  // Helper function to check if name exists
  const hasName = () => {
    return !!(profileData.first_name?.trim() || profileData.last_name?.trim())
  }

  // Helper function to display name
  const displayName = () => {
    const firstName = profileData.first_name?.trim() || ""
    const lastName = profileData.last_name?.trim() || ""
    return `${firstName} ${lastName}`.trim()
  }

  // Helper function to check if bio exists
  const hasBio = () => {
    return !!profileData.bio?.trim()
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mb-6">
        <CardHeader className="pb-0 px-6">
          <div className="flex justify-end">
            <ProfileBadge
              className="px-4 py-1.5 text-base font-medium"
              variant={profileData.type === "founder" ? "default" : "success"}
            >
              {profileData.type.charAt(0).toUpperCase() + profileData.type.slice(1)}
            </ProfileBadge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p>{profileData.email}</p>
          </div>

          {hasName() && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p>{displayName()}</p>
            </div>
          )}

          {hasBio() && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
              <p className="text-sm leading-relaxed">{profileData.bio}</p>
            </div>
          )}
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