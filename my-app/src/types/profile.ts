export type Profile = {
  id: string;
  email: string;
  type: 'founder' | 'investor';
  first_name: string;
  last_name: string;
  bio: string;
  active: boolean;
  updated_at: string | null;
};