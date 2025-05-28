export type Notification = {
  id: string;
  type: 'investment_created' | 'investment_accepted'
  seen: boolean;
  recipient_id: string;
  updated_at: string | null;
  created_at: string;
}

export function generateNotificationTitle() {
  // investment_created
  // Investment Created!

  // investment_accepted
  // Investment Accepted!
  return 'TODO';
}

export function generateNotificationMessage() {
  // investment_created
  // An investor has requested to join your fund pool!

  // investment_accepted
  // A startup has accepted your investment request!
  return 'TODO';
}