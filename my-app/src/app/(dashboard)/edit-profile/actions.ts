import { Profile } from "@/types/profile";

export async function updateProfile(id: string, body: Partial<Profile>) {
  const res = await fetch('/api/profiles/' + id, {
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