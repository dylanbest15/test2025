'use client'

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StartupOverviewSchema } from "@/lib/validation/startups";
import { Startup } from "@/types/startup";
import { useState } from "react";
import { toast } from "sonner";

interface StartupOverviewProps {
  startup: Startup;
  updateStartup: (data: Partial<Startup>) => Promise<boolean>
  onClose: () => void
}

export default function StartupOverview({ startup, updateStartup, onClose }: StartupOverviewProps) {
  const [formData, setFormData] = useState({
    overview: startup.overview || "",
  })

  const [overviewCount, setOverviewCount] = useState(startup.overview ? startup.overview.length : 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formChanged, setFormChanged] = useState(false)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (id === "overview") {
      setOverviewCount(value.length)
    }

    // Clear error for this field if it exists
    if (invalidFields.has(id)) {
      const newInvalidFields = new Set(invalidFields)
      newInvalidFields.delete(id)
      setInvalidFields(newInvalidFields)
    }

    // Check if any field has changed from original profile
    const hasChanged =
      formData.overview !== (startup.overview || "")

    setFormChanged(hasChanged || id === "overview" ? value !== (startup.overview || "") : hasChanged)
  }

  const validateForm = (): boolean => {
    // Prepare data for Zod validation
    const updateData: Partial<Startup> = {
      overview: formData.overview,
    }

    const parseResult = StartupOverviewSchema.safeParse(updateData);

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
        overview: formData.overview
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
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div>
        <h3 className="text-lg font-medium">Edit Startup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Update your startup overview that will be displayed to other users.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="overview"
              maxLength={300}
              value={formData.overview}
              onChange={handleInputChange}
              className={cn("h-[200px] resize-none", invalidFields.has("overview") ? "border-destructive" : "" )}
            />
            <div className="text-xs text-right text-muted-foreground">{overviewCount}/300</div>
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