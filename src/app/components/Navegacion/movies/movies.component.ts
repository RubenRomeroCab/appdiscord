import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { Router } from '@angular/router';
import { Movie } from '../../../models/movie.model';
import { AppUser } from '../../../models/appuser.model';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { AppUtils } from '../../../utils/AppUtils';


@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  movies: { movie: Movie; proposer?: AppUser }[] = [];

  selectedGenre: string | null = null;
  searchTerm: string | null = null;
  sortBy: 'createdAt' | 'name' | 'totalVotes' | 'averageRating' = 'createdAt';
  lastVisible: any = null;
  currentPage = 1;
  loading = false;

  user: User | null = null;

  AppUtils = AppUtils;

  constructor(
    private moviesService: MoviesService,
    private usersService: UsersService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.getCurrentUserObservable().subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;

    this.moviesService
      .getMovies(this.sortBy, this.lastVisible, this.searchTerm, this.selectedGenre)
      .subscribe({
        next: (movies) => {
          if (movies.length > 0) {
            this.lastVisible = movies[movies.length - 1];
          }

          // Procesar las películas y cargar los datos de los usuarios
          movies.forEach((movie) => {
            if (!this.movies.find((m) => m.movie.id === movie.id)) {
              this.movies.push({ movie, proposer: undefined });

              // Cargar el usuario correspondiente si no está ya cargado
              this.usersService.getUserById(movie.proposerId).subscribe((user) => {
                const movieWithUser = this.movies.find((m) => m.movie.id === movie.id);
                if (movieWithUser) {
                  movieWithUser.proposer = user;
                }
              });
            }
          });

          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading movies:', error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
    this.movies = []; // Clear current movies
    this.lastVisible = null; // Reset pagination
    this.currentPage = 1; // Reset page count
    this.loadMovies();
  }

  loadMore(): void {
    this.currentPage++;
    this.loadMovies();
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/default-image.png'; // Ruta de la imagen por defecto
  }

  viewMovie(id: string | undefined) {
    this.router.navigate([`/pelicula-detail/${id}`])
  }

  editMovie(id: string | undefined) {
    this.router.navigate([`/create/${id}`])
  }

  deleteMovie(id: string | undefined) {
    if (id) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          if (user) {
            console.log('Authenticated user ID:', user.uid);
  
            this.moviesService.deleteMovie(id).subscribe({
              next: () => {
                this.applyFilters();
              },
              error: (err) => {
                console.log('Error deleting movie:', err);
              },
            });
          } else {
            console.log('User not authenticated, cannot delete movie');
          }
        },
        error: (err) => {
          console.log('Error fetching authenticated user:', err);
        },
      });
    } else {
      console.log('Movie ID is undefined, cannot delete');
    }
  }

}
