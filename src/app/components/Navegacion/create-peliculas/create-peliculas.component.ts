import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../../../models/movie.model';
import { MoviesService } from '../../../services/movies.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppUtils } from '../../../utils/AppUtils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-peliculas',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule],
  templateUrl: './create-peliculas.component.html',
  styleUrl: './create-peliculas.component.scss'
})
export class CreatePeliculasComponent {

  pelicula!: Movie

  movieForm: FormGroup;

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private router: Router
  ) {
    this.movieForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      image: ['', [Validators.pattern(/https?:\/\/.+/)]], // Ensure valid URL if provided
      trailer: ['', [Validators.pattern(/https?:\/\/.+/)]], // Ensure valid URL if provided
      genre: ['', [Validators.required]],
    });
  }

  save() {
    if (this.movieForm.valid) {
      const newMovie: Movie = {
        ...this.movieForm.value,
        proposerId: this.authService.getCurrentUser()?.uid,
        createdAt: new Date().toISOString(),
        totalVotes: 0,
        averageRating: 0,
      };

      this.moviesService.addMovie(newMovie)
        .then(() => {
          this.router.navigate(['peliculas']);
        })
        .catch((error: any) => {
          console.log(error.message)
        })
    } else {
      this._snackbar.open("Erro en el formulario", undefined, AppUtils.snackBarErrorConfig);
    }
  }
}
