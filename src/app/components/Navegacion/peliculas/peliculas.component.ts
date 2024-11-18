import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../../services/peliculas.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [],
  templateUrl: './peliculas.component.html',
  styleUrl: './peliculas.component.scss'
})
export class PeliculasComponent implements OnInit {


  peliculas : any = []


  constructor(private servicePeliculas:PeliculasService,
              private router:Router
  ) {}

  ngOnInit(): void {
   this.servicePeliculas.getPeliculas().subscribe((data: any) =>{
    this.peliculas = data
    console.log(this.peliculas)
   })
  }


  cortarTexto(texto: string, longitudMaxima: number): string {
    if (texto.length > longitudMaxima) {
      return texto.substring(0, longitudMaxima) + "...";  // Cortar y agregar "..."
    }
    return texto;  // Si el texto es corto, devuélvelo tal cual
  }


  verPelicula(id:string){
    console.log("Peliculas peliculasComponent y navegamos hasta pelicula-details")
    this.router.navigate([`/pelicula-detail/${id}`])
  }



}
