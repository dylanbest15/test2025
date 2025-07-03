import { FundPool } from "@/types/fund-pool";
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

export async function updateFundPool(id: string, body: Partial<FundPool>) {
  const res = await fetch('/api/fund-pools/' + id, {
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