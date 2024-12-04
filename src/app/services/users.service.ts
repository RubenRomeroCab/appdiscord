import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser.model';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { MoviesService } from './movies.service';
import { UserMoviesService } from './user-movies.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private collectionName = 'users';

  constructor(
    private firestore: Firestore,
    private moviesService: MoviesService,
    private userMoviesService: UserMoviesService
  ) { }

  /**
   * Save a new user to Firestore.
   * @param user - User object to save.
   * @returns An observable that resolves when the user is saved.
   */
  saveUser(user: AppUser): Observable<void> {
    const userRef = doc(this.firestore, `${this.collectionName}/${user.id}`);
    return from(setDoc(userRef, user));
  }

  /**
   * Get a user by their ID.
   * @param userId - ID of the user to fetch.
   * @returns An observable emitting the user data or undefined if not found.
   */
  getUserById(userId: string): Observable<AppUser | undefined> {
    const userRef = doc(this.firestore, `${this.collectionName}/${userId}`);
    return docData(userRef, { idField: 'id' }) as Observable<AppUser | undefined>;
  }

  /**
   * Update user data in Firestore.
   * @param userId - ID of the user to update.
   * @param data - Partial user data to update.
   * @returns An observable that resolves when the update is complete.
   */
  updateUser(userId: string, data: Partial<AppUser>): Observable<void> {
    const userRef = doc(this.firestore, `${this.collectionName}/${userId}`);
    return from(updateDoc(userRef, data));
  }

  getAllUsers(): Observable<AppUser[]> {
    const usersCollection = collection(this.firestore, this.collectionName) as CollectionReference<DocumentData>;
    return collectionData(usersCollection, { idField: 'id' }) as Observable<AppUser[]>;
  }

  calculateReputation(userId: string | undefined): Observable<number> {
    if (!userId) {
        return new Observable((observer) => {
            observer.next(0); // Devolvemos 0 si no hay un userId válido
            observer.complete();
        });
    }

    return this.moviesService.getAllMoviesByUserId(userId).pipe(
        switchMap((movies) => {
            const movieIds = movies.map((movie) => movie.id);

            const reputationObservables = movieIds.map((movieId) =>
                this.userMoviesService.getUserMoviesByMovieId(movieId).pipe(
                    map((userMovies) => 
                        // Excluir las valoraciones realizadas por el propio usuario
                        userMovies
                            .filter((userMovie) => userMovie.userId !== userId)
                            .reduce((sum, userMovie) => sum + (userMovie.rating || 0), 0)
                    )
                )
            );

            // Combine all observables y calcula la reputación total
            return forkJoin(reputationObservables).pipe(
                map((reputations) => reputations.reduce((total, rep) => total + rep, 0))
            );
        })
    );
}
}
