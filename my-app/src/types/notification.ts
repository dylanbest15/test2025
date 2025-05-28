export type Notification = {
  id: string;
  type: 'investment_created' | 'investment_accepted' | 'investment_confirmed'
  seen: boolean;
  recipient_id: string;
  updated_at: string | null;
  created_at: string;
}

export function generateNotificationTitle(notification: Notification): string {
  switch (notification.type) {
    case "investment_created":
      return "Investment Created!"
    case "investment_accepted":
      return "Investment Accepted!"
    case "investment_confirmed":
      return "Investment Confirmed!"
    default:
      return "Notification Alert"
  }
}

export function generateNotificationMessage(notification: Notification): string {
  switch (notification.type) {
    case "investment_created":
      return "An investor has requested to join your fund pool!"
    case "investment_accepted":
      return "A startup has accepted your investment request!"
    case "investment_confirmed":
      return "An investor has confirmed an investment! The investment has been added to your fund pool."
    default:
      return "You have a new notification."
  }
}

export function generateNotificationLabel(notification: Notification): string {
  switch (notification.type) {
    case "investment_created":
      return "Investment"
    case "investment_accepted":
      return "Investment"
    case "investment_confirmed":
      return "Investment"
    default:
      return "Notification"
  }
}
