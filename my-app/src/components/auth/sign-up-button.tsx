"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import { useState, useEffect } from "react"

export function SignupButton({
  children,
  className = "",
  formAction,
  pendingText = "Please wait...",
}: {
  children: React.ReactNode
  className?: string
  formAction: (formData: FormData) => Promise<any>
  pendingText?: string
}) {
  const { pending } = useFormStatus()
  const [type, setType] = useState<string>("founder")

  // Listen for changes to the hidden type input
  useEffect(() => {
    const typeInput = document.querySelector('input[name="type"]') as HTMLInputElement
    if (typeInput) {
      const updateType = () => setType(typeInput.value)

      // Initial value
      updateType()

      // Set up a MutationObserver to watch for value changes
      const observer = new MutationObserver(updateType)
      observer.observe(typeInput, { attributes: true })

      return () => observer.disconnect()
    }
  }, [])

  // Apply different styling based on type
  const buttonClass = `${className} ${type === "founder" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`

  return (
    <Button className={buttonClass} type="submit" formAction={formAction} disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children} {type === "founder" ? "as a Founder" : "as an Investor"}
    </Button>
  )
}