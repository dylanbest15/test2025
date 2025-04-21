import { Member } from "@/types/member";
import { Startup } from "@/types/startup";

export async function createStartup(body: Partial<Startup>) {
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

export async function createMember(body: Partial<Member>) {
  const res = await fetch('/api/members', {
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