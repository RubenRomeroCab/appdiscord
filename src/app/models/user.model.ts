export interface User {
  id: string; // Unique identifier
  name: string; // Full name of the user
  email: string; // Email address
  avatar?: string; // Optional profile picture URL
  reputation: number; // Reputation points
  likedGenres?: Record<string, number>; // Genre preferences as { genre: count }
}