export interface Movie {
    id?: string; // Unique identifier (optional for new movies)
    name: string; // Name of the movie
    description?: string; // Detailed description
    image?: string; // URL of the movie image
    trailer?: string; // URL of the trailer video
    genre: string; // Movie genre (e.g., "comedy", "drama")
    proposerId: string; // ID of the user who proposed the movie
    createdAt: string; // ISO date of when the movie was added
    totalVotes: number; // Total number of votes the movie has received
    averageRating: number; // Average rating (1-5)
    isNextToWatch: boolean; // Indicates if this movie is the next to be watched
}