import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private collectionName = 'movies';

  constructor(private firestore: Firestore) {}

  async addMovie(movieData: Omit<Movie, 'id'>): Promise<string> {
    const moviesCollection = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(moviesCollection, movieData);

    // Return the generated ID
    return docRef.id;
  }

  async getMovies(): Promise<Movie[]> {
    const moviesCollection = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(moviesCollection);

    return snapshot.docs.map((doc) =>
      Movie.fromFirestore(doc.id, doc.data() as Partial<Movie>)
    );
  }
  
}
