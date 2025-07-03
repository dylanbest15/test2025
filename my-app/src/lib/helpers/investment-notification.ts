import { Investment } from "@/types/investment"
import type { Notification } from "@/types/notification"

/**
 * Maps investment status to notification configuration
 * @param investmentData - The investment data containing status and IDs
 * @returns Notification configuration or null if no notification should be sent
 */
export function getNotificationConfigForInvestment(investmentData: Investment): Partial<Notification> | null {
  const statusNotificationMap: Record<string, (data: Investment) => Partial<Notification>> = {
    needs_action: (data) => ({
      type: "investment_created",
      recipient_id: data.startup_id
    }),
    pending: (data) => ({
      type: "investment_accepted",
      recipient_id: data.profile_id,
    }),
    confirmed: (data) => ({
      type: "investment_confirmed",
      recipient_id: data.startup_id,
    }),
    declined: (data) => ({
      type: "investment_declined",
      recipient_id: data.profile_id
    }),
    withdrawn: (data) => ({
      type: "investment_withdrawn",
      recipient_id: data.startup_id
    }),
    inactive: (data) => ({
      type: "investment_inactive",
      recipient_id: data.profile_id
    })
  }

  const configGenerator = statusNotificationMap[investmentData.status]

  if (!configGenerator) {
    // Return null if no notification should be sent for this status
    return null
  }

  return configGenerator(investmentData)
}
