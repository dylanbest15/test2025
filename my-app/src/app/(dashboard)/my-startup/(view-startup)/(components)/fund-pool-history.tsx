"use client"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, Calendar, Target, CheckCircle, Timer, TimerIcon, Trophy, DollarSign } from "lucide-react"
import type { FundPool } from "@/types/fund-pool"

interface FundPoolHistoryProps {
  fundPools: FundPool[]
  onClose: () => void
}

export default function FundPoolHistory({ fundPools, onClose }: FundPoolHistoryProps) {
  // Filter only completed fund pools
  const completedFundPools = fundPools.filter((pool) => pool.status === "completed")

  // Calculate total amount raised across all completed pools
  const totalAmountRaised = completedFundPools.reduce((total, pool) => total + pool.fund_goal, 0)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateDuration = (createdAt: string, updatedAt: string | null) => {
    if (!updatedAt) return "Unknown"

    const created = new Date(createdAt)
    const completed = new Date(updatedAt)
    const diffTime = Math.abs(completed.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Fund Pool History</h2>
          <p className="text-sm text-gray-600 mt-1">View your completed fund pools</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {completedFundPools.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Fund Pools</h3>
            <p className="text-gray-600 max-w-sm">
              You haven't completed any fund pools yet. Once you close a fund pool, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Section */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent>
                <div className="text-md font-semibold text-green-800 flex items-center gap-2 pb-2">
                <Trophy className="w-5 h-5" />
                  Total Funded:
                </div>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(totalAmountRaised)}</p>
              </CardContent>
            </Card>

            {/* Fund Pool List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Completed Fund Pools</h3>
              {completedFundPools
                .sort((a, b) => {
                  // Handle null values in sorting
                  const aDate = a.updated_at ? new Date(a.updated_at).getTime() : 0
                  const bDate = b.updated_at ? new Date(b.updated_at).getTime() : 0
                  return bDate - aDate
                })
                .map((pool, index) => (
                  <Card key={pool.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 pt-2 pb-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Fund Pool #{completedFundPools.length - index}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-600">Created on <span className="font-medium">{formatDate(pool.created_at)}</span></span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCircle className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-600">Completed on <span className="font-medium">{formatDate(pool.updated_at)}</span></span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Trophy className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-600">Goal reached in <span className="font-medium">{calculateDuration(pool.created_at, pool.updated_at)}</span></span>
                            </div>
                          </div>
                        </div>
                        {/* <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completed
                        </Badge> */}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">Amount Funded</span>
                          </div>
                          <p className="text-xl font-bold text-green-900">{formatCurrency(pool.fund_goal)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}