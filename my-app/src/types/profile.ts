export type Profile = {
  id: string;
  email: string;
  type: 'founder' | 'investor'
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
  founder_title: string;
  startup_id: string;
  startup_role: 'admin' | 'member'
  investor_active: boolean;
  updated_at: string | null;
};

// Helper function to display name
export const displayName = (profile: Profile) => {
  const firstName = profile.first_name?.trim() || ""
  const lastName = profile.last_name?.trim() || ""
  return `${firstName} ${lastName}`.trim()
}

// Helper function to get initials for avatar
export const getInitials = (profile: Profile) => {
  const firstName = profile.first_name?.trim() || ""
  const lastName = profile.last_name?.trim() || ""

  if (!firstName && !lastName) return "?"

  const firstInitial = firstName ? firstName[0].toUpperCase() : ""
  const lastInitial = lastName ? lastName[0].toUpperCase() : ""

  return `${firstInitial}${lastInitial}`
}
