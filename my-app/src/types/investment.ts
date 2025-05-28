// Investment Status Notes
// investment is created -> needs action
// startup accepts request -> pending
// investor confirms request -> confirmed
// at any point, startup can decline request -> declined OR investor can withdraw request -> withdrawn

export type Investment = {
  id: string;
  amount: number;
  status: 'needs action' | 'pending' | 'confirmed' | 'declined' | 'withdrawn';
  fund_pool_id: string;
  startup_id: string;
  profile_id: string;
  updated_at: string | null;
  created_at: string;
}