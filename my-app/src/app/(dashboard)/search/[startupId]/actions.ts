import { FundPool } from "@/types/fund-pool";

export async function getFundPool(startupId: string): Promise<FundPool | null> {
  const res = await fetch('/api/fund_pools/' + startupId, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch fund pool');
  return res.json();
}