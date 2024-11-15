import { Injectable } from '@angular/core';
import { addDoc, collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { PeliculaModel } from '../models/peliculas.model';


@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  peliculas!: Observable<any[]>;
  peliculasData: any[] = [];
  private peliculasCollection:any;

  constructor(private servicePeliculas: Firestore) { 
    this.peliculasCollection = collection(this.servicePeliculas,'peliculas')
  }

  getPeliculas() {
    const peliculasCollection = collection(this.servicePeliculas, 'peliculas');
    return this.peliculas = collectionData(peliculasCollection);
  }

  addMovies(pelicula:PeliculaModel){
    return addDoc(this.peliculasCollection,{...pelicula});
  }
}
