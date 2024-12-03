export interface UserMovie {
    id?: string; // Unique identifier (optional for new records)
    userId: string; // ID of the user
    movieId: string; // ID of the movie
    status: 'voting' | 'watched'; // Status relative to the user
    rating?: number; // User's rating for the movie (1-5)
    hasVoted: boolean; // Whether the user has voted for this movie
    createdAt: string; // ISO date of when this record was created
  }