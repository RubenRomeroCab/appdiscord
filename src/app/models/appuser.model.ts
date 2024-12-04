export interface AppUser {
  id: string; // Unique identifier
  name: string;
  avatar?: string;
  reputation: number; // Reputation points
  likedGenres?: Record<string, number>; // Genre preferences as { genre: count }
}