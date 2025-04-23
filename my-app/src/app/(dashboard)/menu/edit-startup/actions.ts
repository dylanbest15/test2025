import { Startup } from "@/types/startup";

export async function updateStartup(id: string, body: Partial<Startup>) {
  const res = await fetch('/api/startups/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(result.error));
  }
  return result;
}