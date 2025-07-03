export type Notification = {
  id: string;
  type: 'investment_created' | 'investment_accepted' | 'investment_confirmed' | 'investment_declined' | 'investment_withdrawn' | 'investment_inactive'
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
    case "investment_declined":
      return "Investment Declined."
    case "investment_withdrawn":
      return "Investment Withdrawn."
    case "investment_inactive":
      return "Investment Inactive."
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
    case "investment_declined":
      return "A startup has declined your investment request."
    case "investment_withdrawn":
      return "An investor has withdrawn their investment request."
    case "investment_inactive":
      return "An investor has closed their fund pool. Your investment request is now inactive."
    default:
      return "You have a new notification."
  }
}

export function generateNotificationLabel(notification: Notification): string {
  switch (notification.type) {
    case "investment_created":
    case "investment_accepted":
    case "investment_confirmed":
    case "investment_declined":
    case "investment_withdrawn":
    case "investment_inactive":
      return "Investment"
    default:
      return "Notification"
  }
}
