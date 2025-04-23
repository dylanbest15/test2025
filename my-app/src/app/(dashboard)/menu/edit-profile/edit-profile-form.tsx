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
import { updateProfile } from "@/app/(dashboard)/menu/edit-profile/actions"
import { Checkbox } from "@/components/ui/checkbox"

interface EditProfileFormProps {
  profile: Profile
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const [name, setName] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    founder_title: profile.founder_title || "",
    investor_active: profile.investor_active,
  })

  const [bio, setBio] = useState(profile.bio || "")
  const [bioCount, setBioCount] = useState(profile.bio ? profile.bio.length : 0)

  const [isSubmittingName, setIsSubmittingName] = useState(false)
  const [isSubmittingBio, setIsSubmittingBio] = useState(false)

  const [nameChanged, setNameChanged] = useState(false)
  const [bioChanged, setBioChanged] = useState(false)

  // Update state if profile prop changes
  useEffect(() => {
    setName({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      founder_title: profile.founder_title || "",
      investor_active: profile.investor_active,
    })
    setBio(profile.bio || "")
    setBioCount(profile.bio ? profile.bio.length : 0)
    setNameChanged(false)
    setBioChanged(false)
  }, [profile])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = {
      ...name,
      [e.target.id]: e.target.value,
    }
    setName(updatedName)

    // Check if any name-related field has changed
    const hasNameChanged =
      updatedName.first_name !== (profile.first_name || "") ||
      updatedName.last_name !== (profile.last_name || "") ||
      (profile.type === "founder" && updatedName.founder_title !== (profile.founder_title || "")) ||
      (profile.type === "investor" && updatedName.investor_active !== profile.investor_active)

    setNameChanged(hasNameChanged)
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value
    setBio(newBio)
    setBioCount(newBio.length)
    setBioChanged(newBio !== (profile.bio || ""))
  }

  const handleCheckboxChange = (checked: boolean) => {
    const updatedName = { ...name, investor_active: checked }
    setName(updatedName)
    setNameChanged(updatedName.investor_active !== profile.investor_active)
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingName(true)

    try {
      const updateData: Partial<Profile> = {
        first_name: name.first_name,
        last_name: name.last_name,
      }

      // Include founder_title field if profile is founder type
      if (profile.type === "founder") {
        updateData.founder_title = name.founder_title
      }

      // Include investor_active field if profile is investor type
      if (profile.type === "investor") {
        updateData.investor_active = name.investor_active
      }

      await updateProfile(profile.id, updateData)
      toast.success("Name Updated", {
        description: "Your profile information has been saved.",
      })
      setNameChanged(false)
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
      setIsSubmittingName(false)
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
      setBioChanged(false)
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
      <Tabs defaultValue="name" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="name">Name</TabsTrigger>
          <TabsTrigger value="bio">Bio</TabsTrigger>
        </TabsList>

        <TabsContent value="name" className="border rounded-md p-4">
          <form onSubmit={handleNameSubmit} className="space-y-4">
            {/* <div className="text-lg font-medium">Name</div> */}
            <p className="text-sm text-muted-foreground">
              This is the information about you as a founder that will displayed to other users.
            </p>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name:</Label>
              <Input id="first_name" value={name.first_name} onChange={handleNameChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name:</Label>
              <Input id="last_name" value={name.last_name} onChange={handleNameChange} />
            </div>

            {profile.type === "founder" && (
              <div className="space-y-2">
                <Label htmlFor="founder_title">Title:</Label>
                <Input id="founder_title" value={name.founder_title} onChange={handleNameChange} />
              </div>
            )}

            {profile.type === "investor" && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  When your profile is set to 'Active', founders can send you invite notifications to view their
                  startups.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="investor_active"
                      checked={name.investor_active || false}
                      onCheckedChange={handleCheckboxChange}
                    />
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
              <Button type="submit" className="w-full" disabled={isSubmittingName || !nameChanged}>
                {isSubmittingName ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bio" className="border rounded-md p-4">
          <form onSubmit={handleBioSubmit} className="space-y-4">
            {/* <div className="text-lg font-medium">Biography</div> */}
            <p className="text-sm text-muted-foreground">
              This is your founder bio that other users will read to learn about you.
            </p>

            <div className="space-y-2 p-1">
              <Label htmlFor="bio">Keep it brief and highlight relevant experience. Max 300 characters.</Label>
              <Textarea
                id="bio"
                className="h-[150px] w-full max-w-[300px] text-sm"
                maxLength={300}
                value={bio}
                onChange={handleBioChange}
              />
              <div className="text-xs text-right text-muted-foreground">{bioCount}/300</div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmittingBio || !bioChanged}>
                {isSubmittingBio ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}