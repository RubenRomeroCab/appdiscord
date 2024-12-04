import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../../../models/movie.model';
import { MoviesService } from '../../../services/movies.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppUtils } from '../../../utils/AppUtils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-movies',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './create-movies.component.html',
  styleUrl: './create-movies.component.scss'
})
export class CreateMoviesComponent implements OnInit {

  movieForm: FormGroup;
  movieId: string | null = null;
  proposer: any;

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.movieForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      image: ['', [Validators.pattern(/https?:\/\/.+/)]], // Ensure valid URL if provided
      trailer: ['', [Validators.pattern(/https?:\/\/.+/)]], // Ensure valid URL if provided
      genre: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Obtener el ID de la película desde los parámetros de la URL
    this.movieId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.movieId) {
      // Si hay un ID, cargar la película para editar
      this.moviesService.getMovieById(this.movieId).subscribe(
        (movie) => {
          this.movieForm.patchValue(movie);
          this.proposer = movie.proposerId;
        },
        (error) => {
          console.error('Error loading movie:', error.message);
          this._snackbar.open('Error loading the movie', undefined, AppUtils.snackBarErrorConfig);
        }
      );
    }
  }

  submit(): void {
    if (this.movieForm.valid) {
      const movieData: Partial<Movie> = {
        ...this.movieForm.value,
      };
  
      if (this.movieId) {
        // Si hay un ID, actualizar la película
        // Excluir campos inmutables
        const updateData: Partial<Movie> = {
          name: movieData.name,
          description: movieData.description,
          image: movieData.image,
          trailer: movieData.trailer,
          genre: movieData.genre,
        };
  
        this.moviesService.updateMovie(this.movieId, updateData).subscribe(
          () => {
            this.router.navigate(['peliculas']);
          },
          (error) => {
            console.error('Error updating movie:', error.message);
            this._snackbar.open('Error updating the movie', undefined, AppUtils.snackBarErrorConfig);
          }
        );
      } else {
        // Si no hay un ID, crear una nueva película
        const newMovie = new Movie({
          ...movieData,
          proposerId: this.authService.getCurrentUser()?.uid || '',
          createdAt: new Date().toISOString(),
        });
  
        this.moviesService.addMovie(newMovie.toFirestore()).subscribe(
          () => {
            this.router.navigate(['peliculas']);
          },
          (error) => {
            console.error('Error adding movie:', error.message);
            this._snackbar.open('Error saving the movie', undefined, AppUtils.snackBarErrorConfig);
          }
        );
      }
    } else {
      this._snackbar.open('Error in the form', undefined, AppUtils.snackBarErrorConfig);
    }
  }
}
