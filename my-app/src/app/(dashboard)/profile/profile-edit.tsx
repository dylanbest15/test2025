"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Profile } from "@/types/profile"

interface ProfileEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  onUpdate: (user: Profile) => void
}

export function ProfileEdit({ open, onOpenChange, profile, onUpdate }: ProfileEditProps) {
  const [formData, setFormData] = useState<Profile>(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: "founder" | "investor") => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription className="sr-only"></SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-6 p-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} className="min-h-[120px]" />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}