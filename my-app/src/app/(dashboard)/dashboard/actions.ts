import { Investment } from "@/types/investment";

export async function updateInvestment(id: string, body: Partial<Investment>) {
  const res = await fetch('/api/investments/' + id, {
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