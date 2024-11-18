import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../../services/peliculas.service';
import { ActivatedRoute } from '@angular/router';
import { PeliculaModel } from '../../../models/peliculas.model';
import { DomseguroPipe } from '../../../pipes/domseguro.pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-pelicula-details',
  standalone: true,
  imports: [DomseguroPipe,CommonModule],
  templateUrl: './pelicula-details.component.html',
  styleUrl: './pelicula-details.component.scss'
})
export class PeliculaDetailsComponent implements OnInit{

  pelicula!:PeliculaModel | null;
  link!:string | null

  constructor(private peliculaService:PeliculasService,
              private activateRouter:ActivatedRoute,
              
  ){
  }
  
  ngOnInit(): void {
    console.log("ESTAMOS EN EL COMPONENTE PELICULA DETAILS")
     const id = this.activateRouter.snapshot.paramMap.get('id');
    if(id){
      this.peliculaService.getPeliculaById(id).pipe(take(1)).subscribe((data:PeliculaModel|undefined) =>{
      if(data)
        this.pelicula= data;
      console.log(this.pelicula)
      if(this.pelicula){
        this.link = this.pelicula.trailer.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
      }
      })
    }
  } ;
  


  

}