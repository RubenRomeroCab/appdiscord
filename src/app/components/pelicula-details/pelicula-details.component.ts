import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { ActivatedRoute } from '@angular/router';
import { PeliculaModel } from '../../models/peliculas.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pelicula-details',
  standalone: true,
  imports: [],
  templateUrl: './pelicula-details.component.html',
  styleUrl: './pelicula-details.component.scss'
})
export class PeliculaDetailsComponent implements OnInit {

  pelicula!:PeliculaModel | null;

  constructor(private peliculaService:PeliculasService,
              private activateRouter:ActivatedRoute
  ){}


  ngOnInit(): void {
    const id = this.activateRouter.snapshot.paramMap.get('id');
    if(id){
      this.peliculaService.getPeliculaById(id).subscribe((data:PeliculaModel|undefined) =>{
      if(data)
        this.pelicula= data;
      })
    }
    
  }


}
