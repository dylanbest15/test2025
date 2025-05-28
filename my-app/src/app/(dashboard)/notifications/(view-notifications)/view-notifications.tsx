"use client"

import type { Notification } from "@/types/notification"
import NotificationCard from "@/app/(dashboard)/notifications/(view-notifications)/notification-card"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

interface ViewNotificationsProps {
  notifications: Notification[]
}

export default function ViewNotifications({ notifications }: ViewNotificationsProps) {
  const unreadCount = notifications.filter((notification) => !notification.seen).length
  const hasNotifications = notifications.length > 0

  return (
    <div className="w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-5 w-full">
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
          {!hasNotifications ? (
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex flex-col items-center justify-center py-36">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet.</h3>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}