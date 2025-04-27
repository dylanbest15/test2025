import { FundPool } from "@/types/fund-pool";

export async function createFundPool(body: Partial<FundPool>): Promise<FundPool> {
  const res = await fetch('/api/fund-pools', {
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