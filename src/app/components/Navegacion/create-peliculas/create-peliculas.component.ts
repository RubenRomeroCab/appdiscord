import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PeliculaModel } from '../../../models/peliculas.model';
import { PeliculasService } from '../../../services/peliculas.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-peliculas',
  standalone: true,
  imports: [FormsModule,RouterLink],
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


  esYoutubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(&.*)?$/;
    return youtubeRegex.test(url);
  }


  subir(form:NgForm){
    console.log(form.value);  
    if(form.invalid){
      return
    }else{
      if (!this.esYoutubeUrl(this.pelicula.trailer)) {
        console.log('La URL del tráiler no es válida.');
        return;
      }
      

      //usamos esto para quitar el id de this.pelicula ya que firebase no acepta valores vacios o no definidos 
      //como el id no lo tenemos hasta que se crea por eso lo hacemos asi 
      const peliculaData ={...this.pelicula};
      delete peliculaData.id;


      this.serviceMovies.addMovies(peliculaData)
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
