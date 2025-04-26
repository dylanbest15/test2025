export type FundPool = {
  id: string;
  startup_id: string;
  fund_goal: number;
  status: 'open' | 'completed';
  updated_at: string | null;
  created_at: string;
}