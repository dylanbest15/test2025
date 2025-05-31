import { Investment } from "@/types/investment";
import { Startup } from "@/types/startup";

export async function getStartups(
  query: string, 
  city?: string, 
  state?: string,
  industry?: string
): Promise<Startup[]> {
  const params = new URLSearchParams()

  if (query) {
    params.append("query", query)
  }
  if (city) {
    params.append("city", city)
  }
  if (state) {
    params.append("state", state)
  }
  if (industry && industry !== "all") {
    params.append("industry", industry)
  }

  const res = await fetch(`/api/startups/?${params.toString()}`, {
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