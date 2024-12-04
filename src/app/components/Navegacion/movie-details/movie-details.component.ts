import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../../models/movie.model';
import { DomseguroPipe } from '../../../pipes/domseguro.pipe';
import { CommonModule } from '@angular/common';
import { AppUtils } from '../../../utils/AppUtils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [DomseguroPipe, CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  movie!: Movie | null;
  trailerLink!: string | null

  movieId: string | null = null;

  constructor(
    private moviesService: MoviesService,
    private activateRouter: ActivatedRoute,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.movieId = this.activateRouter.snapshot.paramMap.get('id');
    if (this.movieId) {
      this.moviesService.getMovieById(this.movieId).subscribe(
        (movie) => {
          this.movie = movie;
          if (movie.trailer) {
            this.trailerLink = 'https://www.youtube.com/embed/' + AppUtils.getYouTubeId(movie.trailer);
          }
        },
        (error) => {
          console.error('Error loading movie:', error.message);
          this._snackbar.open('Error loading the movie', undefined, AppUtils.snackBarErrorConfig);
        }
      );
    }
  };
}
