import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  CollectionReference,
  DocumentData,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from '@angular/fire/firestore';
import { from, map, Observable, switchMap } from 'rxjs';
import { Vote } from '../models/vote.model';

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  private collectionName = 'votes';

  constructor(private firestore: Firestore) { }

  /**
   * Add or update a vote for a movie.
   * @param voteData - The vote data to be created or updated.
   * @returns An observable that resolves when the vote is added or updated.
   */
  addOrUpdateVote(voteData: Omit<Vote, 'id'>): Observable<string> {
    const votesCollection = collection(this.firestore, this.collectionName) as CollectionReference<Vote>;

    // Paso 1: Consulta para verificar si el voto ya existe
    const q = query(
      votesCollection,
      where('movieId', '==', voteData.movieId),
      where('userId', '==', voteData.userId)
    );

    // Definimos la operación de forma inicial
    let operation: Promise<string> = Promise.resolve('');

    // Obtener votos existentes
    const queryPromise = getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Si ya existe un voto
          const existingVote = querySnapshot.docs[0];
          const voteDoc = doc(this.firestore, `${this.collectionName}/${existingVote.id}`);

          // Actualizamos el voto existente
          return updateDoc(voteDoc, { voteType: voteData.voteType }).then(() => {
            return existingVote.id;
          });
        } else {
          // Si no existe, creamos un nuevo voto
          return addDoc(votesCollection, { ...voteData, createdAt: new Date().toISOString() }).then((docRef) => {
            return docRef.id;
          });
        }
      })
      .catch((error) => {
        console.error('Error in addOrUpdateVote:', error);
        throw error;
      });

    // Asignamos la operación para retornar desde el observable
    operation = queryPromise;

    // Emitimos el resultado como observable
    return from(operation);
  }

  /**
   * Delete a vote by its ID.
   * @param voteId - ID of the vote to delete.
   * @returns An observable that resolves when the vote is deleted.
   */
  deleteVote(voteId: string): Observable<void> {
    const voteDoc = doc(this.firestore, `${this.collectionName}/${voteId}`);
    return from(deleteDoc(voteDoc));
  }

  getVotesByUser(userId: string): Observable<Vote[]> {
    const votesCollection = collection(this.firestore, 'votes') as CollectionReference<DocumentData>;
    const q = query(votesCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Vote[]>;
  }

  /**
   * Get votes for a movie.
   * @param movieId - ID of the movie to fetch votes for.
   * @returns An observable emitting the list of votes for the movie.
   */
  getVotesByMovie(movieId: string): Observable<Vote[]> {
    const votesCollection = collection(this.firestore, this.collectionName) as CollectionReference<DocumentData>;
    const q = query(votesCollection, where('movieId', '==', movieId));
    return collectionData(q, { idField: 'id' }) as Observable<Vote[]>;
  }

  /**
   * Get a vote by user and movie.
   * @param userId - ID of the user.
   * @param movieId - ID of the movie.
   * @returns An observable emitting the vote, if it exists.
   */
  getVoteByUserAndMovie(userId: string, movieId: string): Observable<Vote | undefined> {
    const votesCollection = collection(this.firestore, this.collectionName) as CollectionReference<Vote>;
    const q = query(votesCollection, where('movieId', '==', movieId), where('userId', '==', userId));

    return collectionData(q, { idField: 'id' }).pipe(
      map((votes: Vote[]) => (votes.length > 0 ? votes[0] : undefined))
    );
  }

  deleteVotesByMovieId(movieId: string): Observable<void> {
    const votesCollection = collection(this.firestore, this.collectionName) as CollectionReference<Vote>;
    const q = query(votesCollection, where('movieId', '==', movieId));

    return from(getDocs(q)).pipe(
        switchMap((querySnapshot) => {
            const deleteOperations = querySnapshot.docs.map((docSnapshot) =>
                deleteDoc(doc(this.firestore, `${this.collectionName}/${docSnapshot.id}`))
            );
            return from(Promise.all(deleteOperations));
        }),
        map(() => undefined) // Transformar el resultado en void
    );
}
}
