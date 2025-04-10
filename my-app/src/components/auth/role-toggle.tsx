"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Role = "founder" | "investor";

export function RoleToggle() {
  const [role, setRole] = useState<Role>("founder")

  const handleRoleChange = (value: string) => {
    setRole(value as Role)
  }

  return (
    <div className="space-y-6">
      <Tabs value={role} onValueChange={handleRoleChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="founder">Founder</TabsTrigger>
          <TabsTrigger value="investor">Investor</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* <div className="text-center">
        <h2 className="text-xl font-medium">Sign up as a{role === "founder" ? " Founder" : "n Investor"}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "founder"
            ? "Create an account to showcase your startup and connect with investors."
            : "Join to discover promising startups and investment opportunities."}
        </p>
      </div> */}

      {/* Hidden input that will be included in the form submission */}
      <input type="hidden" name="role" value={role} />
    </div>
  )
}
