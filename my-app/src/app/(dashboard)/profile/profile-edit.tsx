"use client"

import type React from "react"
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import type { Profile } from "@/types/profile"
import { updateProfile } from "./actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"

interface ProfileEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  onUpdate: (profile: Profile) => void
}

export function ProfileEdit({ open, onOpenChange, profile, onUpdate }: ProfileEditProps) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<Profile>(profile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const MAX_BIO_LENGTH = 200

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // If it's the bio field and exceeds max length, truncate it
    if (name === "bio" && value.length > MAX_BIO_LENGTH) {
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, MAX_BIO_LENGTH) }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const updateData: Partial<Profile> = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
      }

      // Include active field if profile is investor type
      if (profile.type === "investor") {
        updateData.active = formData.active
      }

      const updatedProfile = await updateProfile(profile.id, updateData)
      onUpdate(updatedProfile)
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Update failed", {
        description: "There was a problem updating your profile.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const bioLength = formData.bio?.length || 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription className="sr-only"></SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-6 p-6">
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={formData.first_name || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={formData.last_name || ""} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="bio">Bio</Label>
                <span className={`text-xs ${bioLength >= MAX_BIO_LENGTH ? "text-red-500" : "text-gray-500"}`}>
                  {bioLength}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                maxLength={MAX_BIO_LENGTH}
                className="min-h-[120px] max-h-[300px] overflow-y-auto resize-none"
              />
            </div>
          </div>
          {profile.type === "investor" && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="active" checked={formData.active || false} onCheckedChange={handleCheckboxChange} />
                <Label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </Label>
                {isMobile ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
                      <DialogTitle>What's this?</DialogTitle>
                      <p className="text-sm text-muted-foreground pt-2">
                        When your profile is set to 'Active', founders can send you invite notifications to view their startups.
                      </p>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>When your profile is set to 'Active', founders can send you invite notifications to view their startups.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
