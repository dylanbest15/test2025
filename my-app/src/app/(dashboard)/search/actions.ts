import { Startup } from "@/types/startup";

export async function getStartups(query: string): Promise<Startup[]> {
  const res = await fetch(`/api/startups/?query=${encodeURIComponent(query)}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}