"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Startup, statesAndProvinces } from "@/types/startup"
import { toast } from "sonner"
import { createStartup } from "@/app/(dashboard)/my-startup/actions"
import { updateProfile } from "@/app/(dashboard)/menu/actions"
import type { Profile } from "@/types/profile"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { StartupCreateSchema } from "@/lib/validation/startups"
import { cn } from "@/lib/utils"

interface CreateStartupFormProps {
  profile: Profile
  onStartupCreated: (startup: Startup) => void
}

export default function CreateStartupForm({ profile, onStartupCreated }: CreateStartupFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const [overviewCount, setOverviewCount] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    year_founded: undefined as number | undefined,
    city: "",
    state: "",
    overview: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: id === "year_founded" ? (value ? Number(value) : undefined) : value,
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
  }

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      state: value,
    }))

    // Clear error for state field if it exists
    if (invalidFields.has("state")) {
      const newInvalidFields = new Set(invalidFields)
      newInvalidFields.delete("state")
      setInvalidFields(newInvalidFields)
    }
  }

  const validateForm = (): boolean => {
    // Prepare data for Zod validation
    const createData = {
      name: formData.name,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      overview: formData.overview,
      year_founded: formData.year_founded,
    }

    const parseResult = StartupCreateSchema.safeParse(createData)

    if (!parseResult.success) {
      // Track which fields are invalid
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

  const handleCreateStartup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newStartup = {
        name: formData.name,
        email: formData.email,
        year_founded: formData.year_founded as number,
        city: formData.city,
        state: formData.state,
        overview: formData.overview,
      }

      const startup: Startup = await createStartup(newStartup)
      await updateProfile(profile.id, {
        startup_id: startup.id,
        startup_role: "admin",
      })

      toast.success("Success!", {
        description: "Your startup has been created successfully.",
      })

      // Pass the created startup back to the parent component
      onStartupCreated(startup)
      setOpen(false)
    } catch (error) {
      console.error("Failed to create startup:", error)
      let errorMessage = "There was a problem creating your startup."
      if (error instanceof Error) {
        try {
          // Try to parse the error message if it's a JSON string
          const parsedError = JSON.parse(error.message)
          errorMessage = parsedError.message || errorMessage
        } catch {
          // If parsing fails, use the error message directly
          errorMessage = error.message || errorMessage
        }
      }
      toast.error("Operation failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h2 className="mb-6 text-xl font-semibold">Join an existing startup.</h2>
        <p className="mb-6 text-gray-500">
          If you need to join a startup that already exists on The Fund Pool, notify the admin of your startup to send
          you an invite.
        </p>
        <Separator />
        <h2 className="mb-6 text-xl font-semibold">Create a new startup.</h2>
        <p className="mb-6 text-gray-500">
          If your startup hasn't been added yet then you can create it here. You will be the admin of your startup and
          you can send invites your co-founders to join.
        </p>
        <Button onClick={() => setOpen(true)}>Create a Startup</Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full md:max-w-3xl lg:max-w-4xl overflow-y-auto"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only"></SheetTitle>

          <div className="p-4 space-y-4 w-full">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Create Startup</h3>
              <p className="text-sm text-muted-foreground">Enter the details of your new startup.</p>
            </div>

            <form onSubmit={handleCreateStartup} className="space-y-4 w-full mb-[50px]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Startup Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={cn(invalidFields.has("name") ? "border-destructive" : "")}
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
                    className={cn(invalidFields.has("email") ? "border-destructive" : "")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_founded">Year Founded</Label>
                  <Input
                    id="year_founded"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 2025"
                    value={formData.year_founded || ""}
                    onChange={handleInputChange}
                    className={cn(invalidFields.has("year_founded") ? "border-destructive" : "")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={cn(invalidFields.has("city") ? "border-destructive" : "")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State or Province</Label>
                  <Select value={formData.state} onValueChange={handleStateChange}>
                    <SelectTrigger
                      id="state"
                      className={cn("w-full", invalidFields.has("state") ? "border-destructive" : "")}
                      autoFocus
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {statesAndProvinces.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    className={cn("h-[100px] resize-none", invalidFields.has("overview") ? "border-destructive" : "")}
                    maxLength={300}
                  />
                  <div className="text-xs text-right text-muted-foreground">{overviewCount}/300</div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <SheetClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Startup"}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}