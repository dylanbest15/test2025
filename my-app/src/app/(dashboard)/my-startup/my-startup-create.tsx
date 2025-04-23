"use client"

import type React from "react"
import { useState } from "react"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Startup, statesAndProvinces } from "@/types/startup"
import { toast } from "sonner";
import { createStartup } from "./actions"
import { updateProfile } from "../menu/edit-profile/actions"
import { Profile } from "@/types/profile"

interface MyStartupCreateProps {
  profile: Profile;
}

export default function MyStartupCreate({ profile }: MyStartupCreateProps) {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const router = useRouter()

  const handleCreateStartup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const yearFoundedValue = formData.get("year_founded") as string

      const newStartup = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        overview: formData.get("overview") as string,
        year_founded: Number.parseInt(yearFoundedValue, 10),
      }

      const startup: Startup = await createStartup(newStartup)
      await updateProfile(profile.id, {
        startup_id: startup.id,
        startup_role: 'admin'
      })

      toast.success("Success!", {
        description: "Your startup has been created successfully.",
      })


      // TODO FIX THIS
      // Redirect to the startups page or refresh the current page
      // router.push("/company") ??
      // router.refresh() ??
      // possibly make this create flow a pop out and pass startup back to company view after creation.
      setShowForm(false);
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

  if (!showForm) {
    return (
      <div className="container mx-auto py-10 p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl font-bold">My Startups</h1>
          <div className="max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">You are do not have a startup.</h2>
            <p className="mb-6 text-gray-500">Create your first startup to get started.</p>
            <Button onClick={() => setShowForm(true)}>Create a Startup</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 p-6 mb-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Create a Startup</h1>
        <Card>
          <CardHeader>
            <CardTitle>Startup Information</CardTitle>
            <CardDescription>Enter the details of your new startup.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStartup} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Company Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select name="state" required>
                      <SelectTrigger id="state">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Company Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    placeholder="Describe your startup..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_founded">Year Founded</Label>
                  <Input
                    id="year_founded"
                    name="year_founded"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    placeholder={new Date().getFullYear().toString()}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Startup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
