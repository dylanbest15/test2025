export type Profile = {
  id: string;
  email: string;
  type: 'founder' | 'investor';
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
  founder_title: string;
  startup_id: string;
  startup_role: 'admin' | 'member';
  investor_active: boolean;
  updated_at: string | null;
};
