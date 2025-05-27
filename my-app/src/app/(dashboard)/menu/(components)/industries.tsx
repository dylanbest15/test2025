"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { INDUSTRIES } from "@/types/industries"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DialogTitle } from "@radix-ui/react-dialog"

interface IndustriesProps {
  initialIndustries?: string[]
  updateIndustries: (industries: string[]) => Promise<boolean>
  onClose: () => void
  maxSelections?: number
}

export default function Industries({
  initialIndustries = [],
  updateIndustries,
  onClose,
  maxSelections = 3
}: IndustriesProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialIndustries)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formChanged, setFormChanged] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Check if the selection has changed from the initial value
    const hasChanged =
      selectedIndustries.length !== initialIndustries.length ||
      !selectedIndustries.every((industry) => initialIndustries.includes(industry)) ||
      !initialIndustries.every((industry) => selectedIndustries.includes(industry))

    setFormChanged(hasChanged)
  }, [selectedIndustries, initialIndustries])

  const handleSelectIndustry = (industry: string) => {
    setSelectedIndustries((current) => {
      // If already selected, remove it
      if (current.includes(industry)) {
        return current.filter((i) => i !== industry)
      }

      // If we already have maxSelections industries, replace the last one
      if (current.length >= maxSelections) {
        return [...current.slice(0, maxSelections - 1), industry]
      }

      // Otherwise add it to the selection
      return [...current, industry]
    })

    setIsInvalid(false)
  }

  const removeIndustry = (industry: string) => {
    setSelectedIndustries((current) => current.filter((i) => i !== industry))
  }

  const validateForm = (): boolean => {
    // Valid if at least 1 and at most maxSelections industries are selected
    const isValid = selectedIndustries.length >= 1 && selectedIndustries.length <= maxSelections
    setIsInvalid(!isValid)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      if (selectedIndustries.length === 0) {
        toast.error("Please select at least 1 industry")
      } else {
        toast.error(`Please select no more than ${maxSelections} ${maxSelections === 1 ? "industry" : "industries"}`)
      }
      return
    }

    setIsSubmitting(true)

    try {
      await updateIndustries(selectedIndustries)
      toast.success("Industries Updated", {
        description: "Your industry selections have been saved.",
      })
      setFormChanged(false)
      onClose()
    } catch (error) {
      let errorMessage = "Failed to update industries"
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

  // Filter industries based on search query
  const filteredIndustries = INDUSTRIES.filter((industry) => industry.toLowerCase().includes(searchQuery.toLowerCase()))

  // Helper function to get the appropriate text based on selection count
  const getSelectionText = () => {
    if (selectedIndustries.length === 0) {
      return "Select industries..."
    } else if (selectedIndustries.length === maxSelections) {
      return `${maxSelections} ${maxSelections === 1 ? "industry" : "industries"} selected`
    } else {
      return `${selectedIndustries.length}/${maxSelections} selected`
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div>
        <h3 className="text-lg font-medium">Select Industries</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose up to {maxSelections} {maxSelections === 1 ? "industry" : "industries"} that best represent your focus
          or expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industries">Industries</Label>
            <p className="text-xs text-muted-foreground">
              Select at least 1 and up to {maxSelections} {maxSelections === 1 ? "industry" : "industries"}.
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              {selectedIndustries.map((industry) => (
                <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeIndustry(industry)}
                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {industry}</span>
                  </button>
                </Badge>
              ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    isInvalid ? "border-destructive" : "",
                    selectedIndustries.length === maxSelections ? "text-muted-foreground" : "",
                  )}
                  disabled={selectedIndustries.length >= maxSelections && !dialogOpen}
                >
                  {getSelectionText()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
                <DialogTitle className="sr-only"></DialogTitle>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">
                    Select up to {maxSelections} {maxSelections === 1 ? "Industry" : "Industries"}
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search industries..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[300px] rounded-md border p-2">
                    <div className="space-y-1">
                      {filteredIndustries.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">No industries found</p>
                      ) : (
                        filteredIndustries.map((industry) => (
                          <button
                            key={industry}
                            type="button"
                            onClick={() => handleSelectIndustry(industry)}
                            className={cn(
                              "flex w-full items-center rounded-md px-2 py-2 text-sm",
                              "hover:bg-accent hover:text-accent-foreground",
                              selectedIndustries.includes(industry) ? "bg-accent" : "",
                            )}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedIndustries.includes(industry) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {industry}
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setDialogOpen(false)} variant="secondary" className="mr-2">
                      Done
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {isInvalid && selectedIndustries.length === 0 && (
              <p className="text-xs text-destructive mt-1">Please select at least 1 industry.</p>
            )}

            {isInvalid && selectedIndustries.length > maxSelections && (
              <p className="text-xs text-destructive mt-1">
                Please select no more than {maxSelections} {maxSelections === 1 ? "industry" : "industries"}.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !formChanged ||
              selectedIndustries.length === 0 ||
              selectedIndustries.length > maxSelections
            }
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}