"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { displayName, getInitials, type Profile } from "@/types/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface InvestorCardProps {
  investor: Profile
}

export function InvestorCard({ investor }: InvestorCardProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false)

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-0 border-b border-gray-200 bg-white rounded-none">
      <CardContent className="px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6 flex-1">
            <div className="relative -mt-1 -ml-2">
              <Avatar className="h-16 w-16 border border-gray-200">
                <AvatarImage
                  src={investor.avatar_url || "/placeholder.svg"}
                  alt={displayName(investor)}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-600">{getInitials(investor)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{displayName(investor)}</h3>
              <div className="overflow-hidden transition-all duration-300 ease-in-out">
                <p className="text-sm text-gray-600 leading-tight">
                  {isBioExpanded
                    ? investor.bio
                    : investor.bio && investor.bio.length > 100
                      ? investor.bio.substring(0, 100)
                      : investor.bio}
                  {investor.bio && investor.bio.length > 100 && (
                    <>
                      {!isBioExpanded && "..."}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsBioExpanded(!isBioExpanded)
                        }}
                        className="ml-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors inline"
                      >
                        {isBioExpanded ? " See Less" : " See More"}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="relative">
              <button className="absolute -right-4 -top-4 p-2" aria-label="Send message to investor">
                <Send className="h-6 w-6 text-blue-400 hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
