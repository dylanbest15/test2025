"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { statesAndProvinces, type Startup } from "@/types/startup"
import { StartupGeneralInfoSchema } from "@/lib/validation/startups"

interface StartupGeneralInfoProps {
  startup: Startup
  updateStartup: (data: Partial<Startup>) => Promise<boolean>
  onClose: () => void
}

export default function StartupGeneralInfo({ startup, updateStartup, onClose }: StartupGeneralInfoProps) {
  const [formData, setFormData] = useState({
    name: startup?.name || "",
    city: startup?.city || "",
    state: startup?.state || "",
    email: startup?.email || "",
    year_founded: startup?.year_founded || undefined,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formChanged, setFormChanged] = useState(false)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())

  // Update state if startup prop changes
  useEffect(() => {
    setFormData({
      name: startup.name || "",
      city: startup.city || "",
      state: startup.state || "",
      email: startup.email || "",
      year_founded: startup?.year_founded || undefined,
    })
    setFormChanged(false)
    setInvalidFields(new Set())
  }, [startup])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    // Update form data with the new value
    const updatedFormData = {
      ...formData,
      [id]: id === "year_founded" ? (value ? Number(value) : undefined) : value,
    }

    setFormData(updatedFormData)

    // Clear error for this field if it exists
    if (invalidFields.has(id)) {
      const newInvalidFields = new Set(invalidFields)
      newInvalidFields.delete(id)
      setInvalidFields(newInvalidFields)
    }

    // Check if any field has changed from original startup
    const hasChanged =
      updatedFormData.name !== (startup?.name || "") ||
      updatedFormData.city !== (startup?.city || "") ||
      updatedFormData.state !== (startup?.state || "") ||
      updatedFormData.email !== (startup?.email || "") ||
      updatedFormData.year_founded !== startup?.year_founded

    setFormChanged(hasChanged)
  }

  const handleStateChange = (value: string) => {
    // Update form data with the new state value
    const updatedFormData = {
      ...formData,
      state: value,
    }

    setFormData(updatedFormData)

    // Clear error for state field if it exists
    if (invalidFields.has("state")) {
      const newInvalidFields = new Set(invalidFields)
      newInvalidFields.delete("state")
      setInvalidFields(newInvalidFields)
    }

    // Check if state has changed from original startup
    const hasChanged =
      updatedFormData.name !== (startup?.name || "") ||
      updatedFormData.city !== (startup?.city || "") ||
      value !== (startup?.state || "") ||
      updatedFormData.email !== (startup?.email || "") ||
      updatedFormData.year_founded !== startup?.year_founded

    setFormChanged(hasChanged)
  }

  const validateForm = (): boolean => {
    // Prepare data for Zod validation
    const updateData: Partial<Startup> = {
      name: formData.name,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      year_founded: formData.year_founded,
    }

    const parseResult = StartupGeneralInfoSchema.safeParse(updateData)

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
      const updateData: Partial<Startup> = {
        name: formData.name,
        city: formData.city,
        state: formData.state,
        email: formData.email,
        year_founded: formData.year_founded,
      }

      // Use the updateStartup function passed from the parent
      await updateStartup(updateData)

      toast.success("Startup Updated", {
        description: "Your startup information has been saved.",
      })
      setFormChanged(false)
      onClose()
    } catch (error) {
      let errorMessage = "Failed to update startup"
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
    <div className="p-4 space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Edit Startup</h3>
        <p className="text-sm text-muted-foreground mt-1">Update your startup's general information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Startup Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className={invalidFields.has("name") ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-xs text-muted-foreground">This is the email that will appear to investors.</p>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={invalidFields.has("email") ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year_founded">Year Founded</Label>
            <Input
              id="year_founded"
              type="number"
              value={formData.year_founded || ""}
              onChange={handleInputChange}
              placeholder="e.g. 2020"
              className={invalidFields.has("year_founded") ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              className={invalidFields.has("city") ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State or Province</Label>
            <Select value={formData.state} onValueChange={handleStateChange}>
              <SelectTrigger className={`w-full ${invalidFields.has("state") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select a state or province" />
              </SelectTrigger>
              <SelectContent>
                {statesAndProvinces.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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