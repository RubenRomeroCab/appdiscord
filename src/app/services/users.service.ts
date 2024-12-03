import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser.model';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private collectionName = 'users';

  constructor(
    private firestore: Firestore
  ) { }

  /**
   * Save a new user to Firestore.
   * @param user - User object to save.
   */
  async saveUser(user: AppUser): Promise<void> {
    const userRef = doc(this.firestore, `${this.collectionName}/${user.id}`);
    return setDoc(userRef, user);
  }

  /**
   * Get a user by their ID.
   * @param userId - ID of the user to fetch.
   */
  async getUserById(userId: string): Promise<AppUser | undefined> {
    const userRef = doc(this.firestore, `${this.collectionName}/${userId}`);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? (userDoc.data() as AppUser) : undefined;
  }

  /**
   * Update user data in Firestore.
   * @param userId - ID of the user to update.
   * @param data - Partial user data to update.
   */
  async updateUser(userId: string, data: Partial<AppUser>): Promise<void> {
    const userRef = doc(this.firestore, `${this.collectionName}/${userId}`);
    return updateDoc(userRef, data);
  }
}
