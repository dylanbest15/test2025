"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Startup, statesAndProvinces } from "@/types/startup"
import { updateStartup } from "../(startup-section)/actions"


interface EditStartupFormProps {
  startup: Startup
}

export default function EditStartupForm({ startup }: EditStartupFormProps) {
  const [details, setDetails] = useState({
    name: startup.name || "",
    email: startup.email || "",
    city: startup.city || "",
    state: startup.state || "",
    year_founded: startup.year_founded || new Date().getFullYear(),
  })
  const [detailsChanged, setDetailsChanged] = useState(false)
  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false)

  const [overview, setOverview] = useState({
    overview: startup.overview || "",
  })
  const [overviewCount, setOverviewCount] = useState(startup.overview ? startup.overview.length : 0)
  const [overviewChanged, setOverviewChanged] = useState(false)
  const [isSubmittingOverview, setIsSubmittingOverview] = useState(false)

  // Update state if startup prop changes
  useEffect(() => {
    setDetails({
      name: startup.name || "",
      email: startup.email || "",
      city: startup.city || "",
      state: startup.state || "",
      year_founded: startup.year_founded || new Date().getFullYear(),
    })
    setOverview({
      overview: startup.overview || "",
    })
    setOverviewCount(startup.overview ? startup.overview.length : 0)
    setDetailsChanged(false)
    setOverviewChanged(false)
  }, [startup])

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDetails = {
      ...details,
      [e.target.id]: e.target.value,
    }
    setDetails(updatedDetails)

    // Check if any details field has changed
    const hasDetailsChanged =
      updatedDetails.name !== (startup.name || "") ||
      updatedDetails.email !== (startup.email || "") ||
      updatedDetails.city !== (startup.city || "") ||
      updatedDetails.state !== (startup.state || "") ||
      updatedDetails.year_founded !== (startup.year_founded || new Date().getFullYear())

    setDetailsChanged(hasDetailsChanged)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingDetails(true)

    try {
      const updateData: Partial<Startup> = {
        name: details.name,
        email: details.email,
        city: details.city,
        state: details.state,
        year_founded: details.year_founded,
      }

      await updateStartup(startup.id, updateData)
      toast.success("Details Updated", {
        description: "Your startup information has been saved.",
      })
      setDetailsChanged(false)
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
      setIsSubmittingDetails(false)
    }
  }

  const handleOverviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOverview = e.target.value
    setOverview({
      ...overview,
      overview: newOverview,
    })
    setOverviewCount(newOverview.length)
    setOverviewChanged(newOverview !== (startup.overview || ""))
  }

  const handleOverviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingOverview(true)

    try {
      const updateData: Partial<Startup> = {
        overview: overview.overview,
      }

      await updateStartup(startup.id, updateData)
      toast.success("Overview Updated", {
        description: "Your startup overview has been saved.",
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

  const handleStateChange = (value: string) => {
    const updatedDetails = {
      ...details,
      state: value,
    }
    setDetails(updatedDetails)

    // Check if any details field has changed
    const hasDetailsChanged =
      updatedDetails.name !== (startup.name || "") ||
      updatedDetails.email !== (startup.email || "") ||
      updatedDetails.city !== (startup.city || "") ||
      updatedDetails.state !== (startup.state || "") ||
      updatedDetails.year_founded !== (startup.year_founded || new Date().getFullYear())

    setDetailsChanged(hasDetailsChanged)
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="border rounded-md p-4">
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is the basic information about your startup that will be displayed to investors.
            </p>

            <div className="space-y-2">
              <Label htmlFor="name">Startup Name:</Label>
              <Input id="name" value={details.name} onChange={handleDetailsChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email:</Label>
              <Input id="email" type="email" value={details.email} onChange={handleDetailsChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City:</Label>
              <Input id="city" value={details.city} onChange={handleDetailsChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Province:</Label>
              <Select value={details.state} onValueChange={handleStateChange}>
                <SelectTrigger id="state" autoFocus>
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

            <div className="space-y-2">
              <Label htmlFor="year_founded">Year Founded:</Label>
              <Input
                id="year_founded"
                type="number"
                value={details.year_founded}
                onChange={handleDetailsChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmittingDetails || !detailsChanged}>
                {isSubmittingDetails ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="overview" className="border rounded-md p-4">
          <form onSubmit={handleOverviewSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is your startup overview that investors will read to learn about your company.
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

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmittingOverview || !overviewChanged}>
                {isSubmittingOverview ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="docs" className="border rounded-md p-4">
          <div className="p-4 text-center text-muted-foreground">
            <p>Document upload functionality will be implemented soon.</p>
            <p className="text-sm mt-2">
              This feature will allow you to upload pitch decks, financial documents, and other materials for investors
              to review.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}