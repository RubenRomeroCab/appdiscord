import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser.model';
import { collection, collectionData, CollectionReference, doc, docData, DocumentData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private collectionName = 'users';

  constructor(private firestore: Firestore) {}

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
}
