import { Startup } from "@/types/startup";

export async function createStartup(body: Partial<Startup>): Promise<Startup> {
  const res = await fetch('/api/startups', {
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