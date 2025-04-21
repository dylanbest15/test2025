export type Member = {
  id: string;
  profile_id: string;
  startup_id: string;
  role: 'admin' | 'member';
  updated_at: string;
  created_at: string;
}