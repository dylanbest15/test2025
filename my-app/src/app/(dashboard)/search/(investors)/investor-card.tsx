"use client"

import { Card, CardContent } from "@/components/ui/card"
import { displayName, getInitials, type Profile } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface InvestorCardProps {
  investor: Profile
}

export function InvestorCard({ investor }: InvestorCardProps) {
  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="ps-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={investor.avatar_url || "/placeholder.svg"} alt={displayName(investor)} />
              <AvatarFallback>{getInitials(investor)}</AvatarFallback>
            </Avatar>

            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-base truncate">{displayName(investor)}</h3>
            </div>
            <Send className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </>
  )
}