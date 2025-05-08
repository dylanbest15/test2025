"use client"

import { Card, CardContent } from "@/components/ui/card"
import { displayName, getInitials, type Profile } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface InvestorCardProps {
  investor: Profile
}

export function InvestorCard({ investor }: InvestorCardProps) {
  // Function to truncate bio text
  const truncateBio = (bio: string, maxLength = 150) => {
    if (!bio) return ""
    return bio.length > maxLength ? `${bio.substring(0, maxLength)}...` : bio
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="ps-4">
        <div className="flex justify-between items-start">
          <div className="flex">
            <Avatar className="h-10 w-10 mr-4 flex-shrink-0">
              <AvatarImage src={investor.avatar_url || "/placeholder.svg"} alt={displayName(investor)} />
              <AvatarFallback>{getInitials(investor)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium text-base leading-tight">{displayName(investor)}</h3>
              <p className="text-sm text-gray-500 mt-1">{truncateBio(investor.bio)}</p>
            </div>
          </div>

          <button className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 relative -top-2 -right-2">
            <Send className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}