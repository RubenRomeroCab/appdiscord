import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, startAfter, limit, where, CollectionReference, Query, DocumentData, collectionData, addDoc, doc, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private collectionName = 'movies';

  private pageSize = 5;

  constructor(private firestore: Firestore) { }

  /**
   * Add a new movie to Firestore and return its generated ID.
   * @param movieData - Movie data without the ID.
   * @returns An observable emitting the generated document ID.
   */
  addMovie(movieData: Omit<Movie, 'id'>): Observable<string> {
    const moviesCollection = collection(this.firestore, this.collectionName);

    // Use `from` to convert the promise returned by `addDoc` into an observable
    return from(
      addDoc(moviesCollection, movieData).then((docRef) => {
        return docRef.id;
      })
    );
  }

  /**
   * Fetch movies with pagination, sorting, and filters.
   * @param orderByField - Field to sort by (default: "createdAt").
   * @param lastVisible - Last visible document from the previous page (optional).
   * @param searchTerm - Part of the name to search for (optional).
   * @param genre - Genre to filter by (optional).
   */
  getMovies(
    orderByField: 'createdAt' | 'name' | 'totalVotes' | 'averageRating' = 'createdAt',
    lastVisible: any = null,
    searchTerm: string | null = null,
    genre: string | null = null
  ): Observable<Movie[]> {
    // Create a reference to the collection
    const moviesCollection = collection(this.firestore, this.collectionName) as CollectionReference<DocumentData>;

    // Start building the query
    let q: Query<DocumentData> = query(moviesCollection, orderBy(orderByField), limit(this.pageSize));

    // Add filters
    if (searchTerm) {
      q = query(q, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    }

    if (genre) {
      q = query(q, where('genre', '==', genre));
    }

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    // Use collectionData to return an observable
    return collectionData(q, { idField: 'id' }) as Observable<Movie[]>;
  }

  /**
 * Get a movie by its ID.
 * @param movieId - ID of the movie to fetch.
 * @returns An observable emitting the movie data.
 */
  getMovieById(movieId: string): Observable<Movie> {
    const movieDoc = doc(this.firestore, `${this.collectionName}/${movieId}`);
    return docData(movieDoc, { idField: 'id' }) as Observable<Movie>;
  }

  /**
   * Update a movie by its ID.
   * @param movieId - ID of the movie to update.
   * @param movieData - Partial movie data to update.
   * @returns An observable that resolves when the update is complete.
   */
  updateMovie(movieId: string, movieData: Partial<Movie>): Observable<void> {
    const movieDoc = doc(this.firestore, `${this.collectionName}/${movieId}`);
    return from(updateDoc(movieDoc, movieData));
  }

  /**
   * Delete a movie by its ID.
   * @param movieId - ID of the movie to delete.
   * @returns An observable that resolves when the movie is deleted.
   */
  deleteMovie(movieId: string): Observable<void> {
    // Create a reference to the document
    const movieDoc = doc(this.firestore, `${this.collectionName}/${movieId}`);

    // Use `from` to convert the promise returned by `deleteDoc` into an observable
    return from(deleteDoc(movieDoc));
  }

}
