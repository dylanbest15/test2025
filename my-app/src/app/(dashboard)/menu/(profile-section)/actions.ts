import { Profile } from "@/types/profile";

// export async function getProfile(id: string): Promise<Profile | null> {
//   const res = await fetch('/api/profiles/' + id, {
//     method: 'GET'
//   });
//   if (!res.ok) throw new Error('Failed to fetch profile');
//   return res.json();
// }

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

export async function updateIndustries(id: string, body: string[]) {
  const res = await fetch('/api/industries/' + id + '?type=investor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const result = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(result.error));
  }
  return result;
}

// export async function deleteProfile(id: string) {
//   const res = await fetch('/api/profiles/' + id, {
//     method: 'DELETE',
//   });
//   if (!res.ok) throw new Error('Failed to delete profile');
//   return res.json();
// }