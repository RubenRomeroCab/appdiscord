export interface AppUser {
  id: string; // Unique identifier
  reputation: number; // Reputation points
  likedGenres?: Record<string, number>; // Genre preferences as { genre: count }
}