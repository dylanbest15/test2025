"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Profile } from "@/types/profile"
import { FounderNameAndBioSchema, InvestorNameAndBioSchema } from "@/lib/validation/profiles"
import { cn } from "@/lib/utils"

interface ProfileNameAndBioProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => Promise<boolean>
  onClose: () => void
}

export default function ProfileNameAndBio({ profile, updateProfile, onClose }: ProfileNameAndBioProps) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    founder_title: profile.founder_title || "",
    bio: profile.bio || "",
  })

  const [bioCount, setBioCount] = useState(profile.bio ? profile.bio.length : 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formChanged, setFormChanged] = useState(false)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (id === "bio") {
      setBioCount(value.length)
    }

    // Clear error for this field if it exists
    if (invalidFields.has(id)) {
      const newInvalidFields = new Set(invalidFields)
      newInvalidFields.delete(id)
      setInvalidFields(newInvalidFields)
    }

    // Check if any field has changed from original profile
    const hasChanged =
      formData.first_name !== (profile.first_name || "") ||
      formData.last_name !== (profile.last_name || "") ||
      (profile.type === "founder" && formData.founder_title !== (profile.founder_title || "")) ||
      formData.bio !== (profile.bio || "")

    setFormChanged(hasChanged || id === "bio" ? value !== (profile.bio || "") : hasChanged)
  }

  const validateForm = (): boolean => {
    // Prepare data for Zod validation
    const updateData: Partial<Profile> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      bio: formData.bio,
    }

    // Include founder_title field if profile is founder type
    if (profile.type === "founder") {
      updateData.founder_title = formData.founder_title
    }

    const parseResult = profile.type === "founder" ?
      FounderNameAndBioSchema.safeParse(updateData) :
      InvestorNameAndBioSchema.safeParse(updateData);

    if (!parseResult.success) {
      // Just track which fields are invalid without storing error messages
      const newInvalidFields = new Set<string>()
      const formattedErrors = parseResult.error.format()

      // Add field names with errors to the set
      Object.entries(formattedErrors).forEach(([key, value]) => {
        if (
          key !== "_errors" &&
          ((typeof value === "object" && value !== null && "_errors" in value && value._errors.length > 0) ||
            (Array.isArray(value) && value.length > 0))
        ) {
          newInvalidFields.add(key)
        }
      })

      setInvalidFields(newInvalidFields)
      return false
    }

    setInvalidFields(new Set())
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const updateData: Partial<Profile> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
      }

      // Include founder_title field if profile is founder type
      if (profile.type === "founder") {
        updateData.founder_title = formData.founder_title
      }

      await updateProfile(updateData)
      toast.success("Profile Updated", {
        description: "Your profile information has been saved.",
      })
      setFormChanged(false)
      onClose()
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
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div>
        <h3 className="text-lg font-medium">Edit Profile</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Update your profile information that will be displayed to other users.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input 
              id="first_name" 
              value={formData.first_name} 
              onChange={handleInputChange}
              className={invalidFields.has("first_name") ? "border-destructive" : ""}
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input 
              id="last_name" 
              value={formData.last_name} 
              onChange={handleInputChange} 
              className={invalidFields.has("last_name") ? "border-destructive" : ""}
              />
          </div>

          {profile.type === "founder" && (
            <div className="space-y-2">
              <Label htmlFor="founder_title">Title</Label>
              <Input 
                id="founder_title" 
                value={formData.founder_title} 
                onChange={handleInputChange} 
                className={invalidFields.has("founder_title") ? "border-destructive" : ""}
                />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <p className="text-xs text-muted-foreground">
              Keep it brief and highlight relevant experience.
            </p>
            <Textarea
              id="bio"
              maxLength={300}
              value={formData.bio}
              onChange={handleInputChange}
              className={cn("h-[120px] resize-none", invalidFields.has("bio") ? "border-destructive" : "" )}
            />
            <div className="text-xs text-right text-muted-foreground">{bioCount}/300</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formChanged}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
