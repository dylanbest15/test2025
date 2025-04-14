"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Type = "founder" | "investor";

export function TypeToggle() {
  const [type, setType] = useState<Type>("founder")

  const handleTypeChange = (value: string) => {
    setType(value as Type)
  }

  return (
    <div className="space-y-6">
      <Tabs value={type} onValueChange={handleTypeChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="founder">Founder</TabsTrigger>
          <TabsTrigger value="investor">Investor</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Hidden input that will be included in the form submission */}
      <input type="hidden" name="type" value={type} />
    </div>
  )
}
