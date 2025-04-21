"use client"

import type React from "react"
import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Startup } from "@/types/startup"
import { statesAndProvinces } from "@/types/startup"

interface CompanyEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  startup: Startup
  onUpdate: (startup: Startup) => void
}

export function CompanyEdit({ open, onOpenChange, startup, onUpdate }: CompanyEditProps) {
  const [formData, setFormData] = useState<Startup>(startup)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const MAX_BIO_LENGTH = 200
  const currentYear = new Date().getFullYear()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // If it's the overview field and exceeds max length, truncate it
    if (name === "overview" && value.length > MAX_BIO_LENGTH) {
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, MAX_BIO_LENGTH) }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and ensure it's not in the future
    if (value === "") {
      // If the field is cleared, set to a default value (0 or null depending on what your type allows)
      setFormData((prev) => ({ ...prev, year_founded: 0 })) // or null if your type allows it
    } else if (/^\d+$/.test(value) && Number.parseInt(value) <= currentYear) {
      // Convert to number before setting in state
      setFormData((prev) => ({ ...prev, year_founded: Number.parseInt(value) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const updateData: Partial<Startup> = {
        name: formData.name,
        email: formData.email,
        overview: formData.overview,
        city: formData.city,
        state: formData.state,
        year_founded: formData.year_founded,
      }

      // TODO: update startup api route
      // const updatedStartup = await updateStartup(startup.id, updateData)
      // onUpdate(updatedStartup)
      toast.success("Startup updated", {
        description: "Your startup has been updated successfully.",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating startup:", error)
      toast.error("Update failed", {
        description: "There was a problem updating your startup.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const bioLength = formData.overview?.length || 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle>Edit Startup</SheetTitle>
          <SheetDescription className="sr-only"></SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-2">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium">
                Company Name
              </Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="h-8" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium">
                Company Email
              </Label>
              <Input id="email" name="email" value={formData.email || ""} onChange={handleChange} className="h-8" />
            </div>
            <div className="grid grid-cols-6 gap-3">
              <div className="space-y-1 col-span-4">
                <Label htmlFor="city" className="text-xs font-medium">
                  City
                </Label>
                <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} className="h-8" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="state" className="text-xs font-medium">
                  State
                </Label>
                <Select value={formData.state || ""} onValueChange={handleStateChange}>
                  <SelectTrigger id="state" className="h-8 text-xs" autoFocus>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesAndProvinces.map((state) => (
                      <SelectItem key={state.value} value={state.value} className="text-xs">
                        {state.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="year_founded" className="text-xs font-medium">
                Year Founded
              </Label>
              <Input
                id="year_founded"
                name="year_founded"
                type="number"
                value={formData.year_founded || ""}
                onChange={handleYearChange}
                min="1800"
                max={currentYear}
                placeholder={`Year`}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="overview" className="text-xs font-medium">
                  Overview
                </Label>
                <span className={`text-xs ${bioLength >= MAX_BIO_LENGTH ? "text-red-500" : "text-gray-500"}`}>
                  {bioLength}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <Textarea
                id="overview"
                name="overview"
                value={formData.overview || ""}
                onChange={handleChange}
                maxLength={MAX_BIO_LENGTH}
                className="min-h-[80px] max-h-[120px] text-sm resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2 pb-4 sticky bottom-0 bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-8 text-xs px-3"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-8 text-xs px-3">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
