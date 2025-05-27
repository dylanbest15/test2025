import { Favorite } from "@/types/favorite";
import { Profile } from "@/types/profile";

export async function getInvestors(query: string): Promise<Profile[]> {
  const res = await fetch(`/api/profiles/?query=${encodeURIComponent(query)}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
}

export async function createFavorite(body: Partial<Favorite>): Promise<Favorite> {
  const res = await fetch('/api/favorites', {
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

export async function deleteFavorite(favoriteId: string): Promise<void> {
  const res = await fetch("/api/favorites/" + favoriteId, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const result = await res.json();
    throw new Error(JSON.stringify(result.error));
  }
}