export interface Vote {
    id?: string; // Unique identifier (optional for new votes)
    movieId: string; // ID of the movie being voted on
    userId: string; // ID of the user voting
    voteType: 'like' | 'dislike'; // Type of vote
    createdAt: string; // ISO date of when the vote was made
  }