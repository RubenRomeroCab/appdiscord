import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { Router } from '@angular/router';
import { Movie } from '../../../models/movie.model';


@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [],
  templateUrl: './peliculas.component.html',
  styleUrl: './peliculas.component.scss'
})
export class PeliculasComponent implements OnInit {

  movies: Movie[] = []

  constructor(private moviesService: MoviesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.moviesService.getMovies().then((movies) => {
      this.movies = movies;
    }
    );
  }

  cortarTexto(texto: string, longitudMaxima: number): string {
    if (texto.length > longitudMaxima) {
      return texto.substring(0, longitudMaxima) + "...";  // Cortar y agregar "..."
    }
    return texto;  // Si el texto es corto, devuélvelo tal cual
  }


  verPelicula(id: string | undefined) {
    console.log("Peliculas peliculasComponent y navegamos hasta pelicula-details")
    this.router.navigate([`/pelicula-detail/${id}`])
  }



}
