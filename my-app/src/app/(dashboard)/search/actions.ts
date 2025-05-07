import { Profile } from "@/types/profile";
import { Startup } from "@/types/startup";

export async function getStartups(query: string): Promise<Startup[]> {
  const res = await fetch(`/api/startups/?query=${encodeURIComponent(query)}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch startups');
  return res.json();
}

export async function getInvestors(query: string): Promise<Profile[]> {
  const res = await fetch(`/api/profiles/?query=${encodeURIComponent(query)}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}