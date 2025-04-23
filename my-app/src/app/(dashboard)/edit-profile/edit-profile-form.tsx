"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { Profile } from "@/types/profile"
import { updateProfile } from "@/app/(dashboard)/edit-profile/actions"
import { Checkbox } from "@/components/ui/checkbox"

interface EditProfileFormProps {
  profile: Profile
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const [general, setGeneral] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    founder_title: profile.founder_title || "",
    investor_active: profile.investor_active
  })

  const [bio, setBio] = useState(profile.bio || "")
  const [bioCount, setBioCount] = useState(profile.bio ? profile.bio.length : 0)

  const [isSubmittingGeneral, setIsSubmittingGeneral] = useState(false)
  const [isSubmittingBio, setIsSubmittingBio] = useState(false)

  // Update state if profile prop changes
  useEffect(() => {
    setGeneral({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      founder_title: profile.founder_title || "",
      investor_active: profile.investor_active
    })
    setBio(profile.bio || "")
    setBioCount(profile.bio ? profile.bio.length : 0)
  }, [profile])

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneral({
      ...general,
      [e.target.id]: e.target.value,
    })
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
    setBioCount(e.target.value.length)
  }

  const handleCheckboxChange = (checked: boolean) => {
    setGeneral((prev) => ({ ...prev, investor_active: checked }))
  }

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingGeneral(true)

    try {
      const updateData: Partial<Profile> = {
        first_name: general.first_name,
        last_name: general.last_name,
      }

      // Include founder_title field if profile is founder type
      if (profile.type === "founder") {
        updateData.founder_title = general.founder_title
      }

      // Include investor_active field if profile is investor type
      if (profile.type === "investor") {
        updateData.investor_active = general.investor_active
      }

      await updateProfile(profile.id, updateData);
      toast.success("General Info Updated", {
        description: "Your profile information has been saved.",
      })
      // @dylan do i want something better than this?
      window.location.reload();
    } catch (error) {
      let errorMessage = "Failed to update profile"
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message)
          errorMessage = parsedError.message || errorMessage
        } catch {
          errorMessage = error.message
        }
      }

      toast.error("Update Failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmittingGeneral(false)
    }
  }

  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingBio(true)

    try {
      await updateProfile(profile.id, {
        bio: bio,
      })

      toast.success("Bio Updated", {
        description: "Your bio information has been saved.",
      })
      // @dylan do i want something better than this?
      window.location.reload();
    } catch (error) {
      let errorMessage = "Failed to update bio"
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message)
          errorMessage = parsedError.message || errorMessage
        } catch {
          errorMessage = error.message
        }
      }

      toast.error("Update Failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmittingBio(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="bio">Bio</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="border rounded-md p-4">
          <form onSubmit={handleGeneralSubmit} className="space-y-4">
            <div className="text-lg font-medium">General Info</div>
            <p className="text-sm text-muted-foreground">
              This is the information about you as a founder that will displayed to other users.
            </p>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name:</Label>
              <Input id="first_name" value={general.first_name} onChange={handleGeneralChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name:</Label>
              <Input id="last_name" value={general.last_name} onChange={handleGeneralChange} />
            </div>

            {profile.type === "founder" && (
              <div className="space-y-2">
                <Label htmlFor="founder_title">Title:</Label>
                <Input id="founder_title" value={general.founder_title} onChange={handleGeneralChange} />
              </div>
            )}


            {profile.type === "investor" && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  When your profile is set to 'Active', founders can send you invite notifications to view their startups.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="investor_active" checked={general.investor_active || false} onCheckedChange={handleCheckboxChange} />
                    <Label
                      htmlFor="investor_active"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Active
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmittingGeneral}>
                {isSubmittingGeneral ? "Saving..." : "Save General Info"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bio" className="border rounded-md p-4">
          <form onSubmit={handleBioSubmit} className="space-y-4">
            <div className="text-lg font-medium">Biography</div>
            <p className="text-sm text-muted-foreground">
              This is your founder bio that other users will read to learn about you.
            </p>

            <div className="space-y-2 p-1">
              <Label htmlFor="bio">Keep it brief and highlight relevant experience. Max 300 characters.</Label>
              <Textarea
                id="bio"
                className="min-h-[150px] w-full max-w-[300px] text-sm"
                maxLength={300}
                value={bio}
                onChange={handleBioChange}
              />
              <div className="text-xs text-right text-muted-foreground">{bioCount}/300</div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmittingBio}>
                {isSubmittingBio ? "Saving..." : "Save Bio"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}