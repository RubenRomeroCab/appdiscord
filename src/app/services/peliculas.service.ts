import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  peliculas!: Observable<any[]>;
  peliculasData: any[] = [];
  
  constructor(private servicePeliculas : Firestore) {


   }


   getPeliculas(){
    const peliculasCollection = collection(this.servicePeliculas,'peliculas');
    return this.peliculas = collectionData(peliculasCollection);
   
   }
}
