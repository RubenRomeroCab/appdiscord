import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';
import { Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  user!: User
  peliculas:any =[];
  constructor(private userService: AuthService,
              private moviesService:MoviesService ,
              private router:Router
  ) {
  }
  ngOnInit(): void {
    console.log("Estamos en el component home")
    // this.moviesService.getPeliculas().subscribe((data:any) =>{
    //   this.peliculas= data;
    //   console.log(this.peliculas)
    // });
    
  }

  cortarTexto(texto:string, cantidad:number):string{
    if (texto.length > cantidad) {
      return texto.substring(0, cantidad) + "...";  // Cortar y agregar "..."
    }
    return texto
  }

 
  salir() {
    this.userService.logout();
  }

 verPeliculaDetail(id:string){
    console.log("Peliculas homeComponent desde el home")
    this.router.navigate([`/pelicula-detail/${id}`])
  }

 
}
