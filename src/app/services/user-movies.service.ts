import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of } from 'rxjs';
import { UserMovie } from '../models/user_movie.model';

@Injectable({
  providedIn: 'root'
})
export class UserMoviesService {

  private collectionName = 'user_movies';

  constructor(private firestore: Firestore) {}

  // Crear o actualizar un UserMovie
  addOrUpdateUserMovie(userMovie: Omit<UserMovie, 'id'>): Observable<string> {
    const userMoviesCollection = collection(this.firestore, this.collectionName) as CollectionReference<UserMovie>;
    const q = query(
      userMoviesCollection,
      where('userId', '==', userMovie.userId),
      where('movieId', '==', userMovie.movieId)
    );

    return from(
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const existingRecord = querySnapshot.docs[0];
          const userMovieDoc = doc(this.firestore, `${this.collectionName}/${existingRecord.id}`);
          return updateDoc(userMovieDoc, userMovie).then(() => existingRecord.id);
        } else {
          return addDoc(userMoviesCollection, { ...userMovie, createdAt: new Date().toISOString() }).then(
            (docRef) => docRef.id
          );
        }
      })
    );
  }

  // Obtener un UserMovie por usuario y película
  getUserMovie(userId: string, movieId: string): Observable<UserMovie | null> {
    const userMoviesCollection = collection(this.firestore, this.collectionName) as CollectionReference<UserMovie>;
    const q = query(userMoviesCollection, where('userId', '==', userId), where('movieId', '==', movieId));
    
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          return { ...docData, id: querySnapshot.docs[0].id } as UserMovie;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error fetching user movie:', error);
        return of(null); // Emitir un valor nulo si hay un error
      })
    );
  }
}
