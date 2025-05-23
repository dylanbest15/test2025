import { Profile } from "@/types/profile";
import { Startup } from "@/types/startup";

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

export async function updateProfileIndustries(id: string, body: string[]) {
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

export async function updateStartupIndustries(id: string, body: string[]) {
  const res = await fetch('/api/industries/' + id + '?type=startup', {
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