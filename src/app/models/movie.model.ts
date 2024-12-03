export class Movie {
    id?: string; // Firestore document ID
    name: string;
    description: string;
    image?: string;
    trailer?: string;
    genre: string;
    proposerId: string;
    createdAt: string;
    totalVotes: number = 0;
    averageRating: number = 0;
  
    constructor(data: Partial<Movie>) {
      this.name = data.name || '';
      this.description = data.description || '';
      this.image = data.image || '';
      this.trailer = data.trailer || '';
      this.genre = data.genre || '';
      this.proposerId = data.proposerId || '';
      this.createdAt = data.createdAt || new Date().toISOString();
      this.totalVotes = data.totalVotes || 0;
      this.averageRating = data.averageRating || 0;
    }
  
    /**
     * Prepare the data for Firestore (removes the `id` field).
     * @returns A plain object without `id`.
     */
    toFirestore(): Omit<Movie, 'id'> {
      const { id, ...data } = this;
      return data as Omit<Movie, 'id'>;
    }
  
    /**
     * Convert Firestore document data into a Movie instance.
     * @param id - Firestore document ID.
     * @param data - Firestore document data.
     * @returns A new Movie instance.
     */
    static fromFirestore(id: string, data: Partial<Movie>): Movie {
      const movie = new Movie(data); // Ensure proposerId exists in the data
      movie.id = id;
      return movie;
    }
  }