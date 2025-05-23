import { Favorite } from "@/types/favorite";

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

// TODO: create investment api route