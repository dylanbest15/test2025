import { Investment } from "@/types/investment";
import { Startup } from "@/types/startup";

export async function getStartups(query: string): Promise<Startup[]> {
  const res = await fetch(`/api/startups/?query=${encodeURIComponent(query)}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch startups');
  return res.json();
}

export async function createInvestment(body: Partial<Investment>): Promise<Investment> {
  const res = await fetch('/api/investments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(result.error));
  }
  return result;
}