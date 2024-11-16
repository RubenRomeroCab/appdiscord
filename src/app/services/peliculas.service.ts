import { Injectable } from '@angular/core';
import { addDoc, collectionData, docData, Firestore } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';
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
    this.peliculasCollection = collection(this.servicePeliculas,'peliculas');
  }

  getPeliculas(): Observable<PeliculaModel[]> {
    return collectionData(this.peliculasCollection, { idField: 'id' }) as Observable<PeliculaModel[]>;
  }

  addMovies(pelicula:PeliculaModel){
    return addDoc(this.peliculasCollection,{...pelicula});
  }


  getPeliculaById(id: string): Observable<PeliculaModel | undefined> {
    const peliculaDocRef = doc(this.servicePeliculas, 'peliculas', id);  // Referencia al documento de la película
    return docData(peliculaDocRef, { idField: 'id' }) as Observable<PeliculaModel>;
  }
}
