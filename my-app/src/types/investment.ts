export type Investment = {
  id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  fund_pool_id: string;
  startup_id: string;
  profile_id: string;
  updated_at: string | null;
  created_at: string;
}