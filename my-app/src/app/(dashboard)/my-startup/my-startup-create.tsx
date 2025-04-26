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
import { createStartup } from "./actions"
import { updateProfile } from "../menu/(profile-section)/actions"
import type { Profile } from "@/types/profile"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"

interface MyStartupCreateProps {
  profile: Profile
}

export default function MyStartupCreate({ profile }: MyStartupCreateProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateStartup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const yearFoundedValue = formData.get("year_founded") as string

      const newStartup = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        year_founded: Number.parseInt(yearFoundedValue, 10),
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        overview: formData.get("overview") as string,
      }

      const startup: Startup = await createStartup(newStartup)
      await updateProfile(profile.id, {
        startup_id: startup.id,
        startup_role: "admin",
      })

      toast.success("Success!", {
        description: "Your startup has been created successfully.",
      })
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
        <SheetContent side="right" className="w-full sm:max-w-full md:max-w-3xl lg:max-w-4xl overflow-y-auto" aria-describedby={undefined}>
          <SheetTitle className="sr-only"></SheetTitle>

          <div className="p-4 space-y-4 w-full">
            <div>
              <h3 className="text-lg font-medium">Create Startup</h3>
              <p className="text-sm text-muted-foreground">Enter the details of your new startup.</p>
            </div>

            <form onSubmit={handleCreateStartup} className="space-y-5 w-full">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Startup Name</Label>
                  <Input id="name" name="name" required />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-xs text-muted-foreground">This is the email that will appear to investors.</p>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="year_founded">Year Founded</Label>
                  <Input
                    id="year_founded"
                    name="year_founded"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 2025"
                    required
                  />
                </div>


                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="state">State or Province</Label>
                  <Select name="state" required>
                    <SelectTrigger id="state" className="w-full">
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

                <div className="space-y-1">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    className="h-[100px] resize-none"
                    required
                  />
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