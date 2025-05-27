export type Notification = {
  id: string;
  type: 'investment_created';
  title: string;
  message: string;
  seen: boolean;
  recipient_id: string;
  updated_at: string | null;
  created_at: string;
}