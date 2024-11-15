import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PeliculaModel } from '../../models/peliculas.model';
import { PeliculasService } from '../../services/peliculas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-peliculas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-peliculas.component.html',
  styleUrl: './create-peliculas.component.scss'
})
export class CreatePeliculasComponent {

  pelicula!:PeliculaModel
  
  constructor(private serviceMovies:PeliculasService,
              private serviceUser:AuthService
  ){
    this.pelicula= new PeliculaModel;
    this.serviceUser.user$.subscribe((data:any) =>{
      this.pelicula.idUser = data.displayName;
    })
  }
  subir(form:NgForm){
    console.log(form.value);  
    if(form.invalid){
      return
    }else{
      this.serviceMovies.addMovies(this.pelicula)
      .then(()=>{
        console.log("pelicula agregada")
        form.resetForm;
      })
      .catch((error)=>{
        console.log(error.message)
      })
    }
  }
}
