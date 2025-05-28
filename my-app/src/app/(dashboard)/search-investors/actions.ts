import { Profile } from "@/types/profile";

export async function getInvestors(query: string): Promise<Profile[]> {
  const res = await fetch(`/api/profiles/?query=${encodeURIComponent(query)}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}