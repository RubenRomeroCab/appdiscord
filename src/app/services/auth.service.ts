import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { AppUser } from '../models/appuser.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private usersService: UsersService
  ) {
    // Listen to auth state changes
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);
    });
  }

  /**
   * Register a new user with email and password.
   * @param email - User's email address.
   * @param password - User's chosen password.
   */
  register(name: string, email: string, password: string): Promise<AppUser | null> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {

          updateProfile(user, { displayName: name });

          const newUser: AppUser = {
            id: user.uid,
            reputation: 0,
            likedGenres: {},
          };

          // Save user to Firestore
          return this.usersService.saveUserToFirestore(newUser).then(() => newUser);
        }

        return null;
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        throw error;
      });
  }

  /**
   * Log in an existing user with email and password.
   * @param email - User's email address.
   * @param password - User's password.
   */
  login(email: string, password: string): Promise<User | null> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        console.error('Error during login:', error);
        throw error;
      });
  }

  /**
   * Log out the current user.
   */
  logout(): Promise<void> {
    return signOut(this.auth).catch((error) => {
      console.error('Error during logout:', error);
      throw error;
    });
  }

  /**
   * Get the current logged-in user.
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Observe the current user as an observable.
   */
  getCurrentUserObservable() {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Check if a user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

}
