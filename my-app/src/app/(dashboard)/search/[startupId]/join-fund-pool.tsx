"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"

interface JoinFundPoolProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (amount: number) => void
}

export function JoinFundPool({ open, onOpenChange, onSubmit }: JoinFundPoolProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!amount.trim()) {
      setError("Please enter an amount")
      return
    }

    // Convert to number and validate
    const numericAmount = Number.parseInt(amount.replace(/[^0-9]/g, ""), 10)

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Call the onSubmit callback with the numeric amount
    onSubmit(numericAmount)

    // Reset form
    setAmount("")
    setError("")
  }

  // Format input as currency
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, "")

    if (value === "") {
      setAmount("")
      return
    }

    // Convert to number and format as currency without decimals
    const numericValue = Number.parseInt(value, 10)
    if (!isNaN(numericValue)) {
      // Format with commas for thousands
      setAmount(numericValue.toLocaleString("en-US"))
    }

    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Join Fund Pool</DialogTitle>
          <DialogDescription>Enter an amount that you wish to contribute to this startup's fund pool. They will recieve an email and notification to contact you.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                className="pl-10"
                aria-describedby="amount-error"
              />
            </div>
            {error && (
              <p id="amount-error" className="text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Join Fund Pool
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}