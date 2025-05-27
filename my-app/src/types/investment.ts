// Investment Status Notes
// investment is created -> pending
// startup reviews and recieves investment -> accepted or declined
// if accepted, investor confirms that payment was sent -> confirmed
// if investor withdraws at any point before confirmation -> withdrawn 

export type Investment = {
  id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'confirmed' | 'declined' | 'withdrawn';
  fund_pool_id: string;
  startup_id: string;
  profile_id: string;
  updated_at: string | null;
  created_at: string;
}