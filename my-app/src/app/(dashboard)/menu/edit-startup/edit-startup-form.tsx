"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Startup } from "@/types/startup"
import { updateStartup } from "@/app/(dashboard)/menu/edit-startup/actions"

interface EditStartupFormProps {
  startup: Startup;
}

export default function EditStartupForm({ startup }: EditStartupFormProps) {
  const [overview, setOverview] = useState({
    overview: startup.overview || "",
    email: startup.email || "",
  })

  const [overviewCount, setOverviewCount] = useState(startup.overview ? startup.overview.length : 0)

  const [isSubmittingOverview, setIsSubmittingOverview] = useState(false)
  const [overviewChanged, setOverviewChanged] = useState(false)

  // Update state if startup prop changes
  useEffect(() => {
    setOverview({
      overview: startup.overview || "",
      email: startup.email || "",
    })
    setOverviewCount(startup.overview ? startup.overview.length : 0)
    setOverviewChanged(false)
  }, [startup])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedOverview = {
      ...overview,
      email: e.target.value,
    }
    setOverview(updatedOverview)

    // Check if any overview-related field has changed
    const hasOverviewChanged =
      updatedOverview.email !== (startup.email || "") ||
      updatedOverview.overview !== (startup.overview || "")

    setOverviewChanged(hasOverviewChanged)
  }

  const handleOverviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOverview = e.target.value
    setOverview({
      ...overview,
      overview: newOverview,
    })
    setOverviewCount(newOverview.length)
    setOverviewChanged(newOverview !== (startup.overview || "") || overview.email !== (startup.email || ""))
  }

  const handleOverviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingOverview(true)

    try {
      const updateData: Partial<Startup> = {
        overview: overview.overview,
        email: overview.email,
      }

      await updateStartup(startup.id, updateData)
      toast.success("Overview Updated", {
        description: "Your startup information has been saved.",
      })
      setOverviewChanged(false)
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
      setIsSubmittingOverview(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="border rounded-md p-4">
          <form onSubmit={handleOverviewSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is the basic information about your startup that will be displayed to investors.
            </p>

            <div className="space-y-2 p-1">
              <Label htmlFor="overview">Keep it brief and to the point. Max 300 characters.</Label>
              <Textarea
                id="overview"
                className="h-[150px] w-full max-w-[300px] text-sm"
                maxLength={300}
                value={overview.overview}
                onChange={handleOverviewChange}
              />
              <div className="text-xs text-right text-muted-foreground">{overviewCount}/300</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email for investors to contact your team:</Label>
              <Input id="email" type="email" value={overview.email} onChange={handleEmailChange} />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmittingOverview || !overviewChanged}>
                {isSubmittingOverview ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="team" className="border rounded-md p-4">
          {/* Team tab content will be implemented later */}
          <div className="p-4 text-center text-muted-foreground">
            Team management functionality will be implemented soon.
          </div>
        </TabsContent>

        <TabsContent value="docs" className="border rounded-md p-4">
          {/* Docs tab content will be implemented later */}
          <div className="p-4 text-center text-muted-foreground">
            Document upload functionality will be implemented soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
