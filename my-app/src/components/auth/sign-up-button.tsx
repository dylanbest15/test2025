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
  const [role, setRole] = useState<string>("founder")

  // Listen for changes to the hidden role input
  useEffect(() => {
    const roleInput = document.querySelector('input[name="role"]') as HTMLInputElement
    if (roleInput) {
      const updateRole = () => setRole(roleInput.value)

      // Initial value
      updateRole()

      // Set up a MutationObserver to watch for value changes
      const observer = new MutationObserver(updateRole)
      observer.observe(roleInput, { attributes: true })

      return () => observer.disconnect()
    }
  }, [])

  // Apply different styling based on role
  const buttonClass = `${className} ${role === "founder" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`

  return (
    <Button className={buttonClass} type="submit" formAction={formAction} disabled={pending} aria-disabled={pending}>
      {pending ? pendingText : children} {role === "founder" ? "as a Founder" : "as an Investor"}
    </Button>
  )
}