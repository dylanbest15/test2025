import type { Notification } from "@/types/notification"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, DollarSign, Users, AlertCircle } from "lucide-react"
import { getTimeAgo } from "@/lib/utils"

interface NotificationCardProps {
  notification: Notification
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "investment_created":
      return <DollarSign className="h-5 w-5 text-green-600" />
    case "user_joined":
      return <Users className="h-5 w-5 text-blue-600" />
    case "alert":
      return <AlertCircle className="h-5 w-5 text-orange-600" />
    default:
      return <Bell className="h-5 w-5 text-gray-600" />
  }
}

const getNotificationTypeLabel = (type: string) => {
  switch (type) {
    case "investment_created":
      return "Investment"
    case "user_joined":
      return "User Activity"
    case "alert":
      return "Alert"
    default:
      return "Notification"
  }
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const timeAgo = getTimeAgo(notification.created_at)
  
  return (
    <Card
      className={`transition-all rounded-none shadow-none hover:shadow-md ${!notification.seen ? "bg-blue-50/50" : ""}`}
    >
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-900 truncate">{notification.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.seen && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                <Badge variant="secondary" className="text-xs">
                  {getNotificationTypeLabel(notification.type)}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{notification.message}</p>

            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}