"use client"

import type { Notification } from "@/types/notification"
import NotificationCard from "@/app/(dashboard)/notifications/(view-notifications)/notification-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

interface ViewNotificationsProps {
  notifications: Notification[]
}

export default function ViewNotifications({ notifications }: ViewNotificationsProps) {
  const unreadCount = notifications.filter((notification) => !notification.seen).length
  const hasNotifications = notifications.length > 0

  if (!hasNotifications) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600 text-center">{"You're all caught up! New notifications will appear here."}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">

          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-blue-500">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>

          {/* Card Section */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}