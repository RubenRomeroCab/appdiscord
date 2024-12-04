import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../../models/movie.model';
import { DomseguroPipe } from '../../../pipes/domseguro.pipe';
import { CommonModule } from '@angular/common';
import { AppUtils } from '../../../utils/AppUtils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { VotesService } from '../../../services/votes.service';
import { Vote } from '../../../models/vote.model';
import { UserMoviesService } from '../../../services/user-movies.service';
import { UserMovie } from '../../../models/user_movie.model';
import { UsersService } from '../../../services/users.service';
import { map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [DomseguroPipe, CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  movie: Movie | undefined;
  trailerLink!: string | null

  movieId: string | null = null;

  userVote: Vote | null = null;

  userMovie: UserMovie | null = null;

  constructor(
    private moviesService: MoviesService,
    private activateRouter: ActivatedRoute,
    private authService: AuthService,
    private votesService: VotesService,
    private userMoviesService: UserMoviesService,
    private _snackbar: MatSnackBar,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.movieId = this.activateRouter.snapshot.paramMap.get('id');
    if (this.movieId) {
      this.loadMovieDetails();
      this.loadUserInteractions();
    }
  }

  private loadMovieDetails(): void {
    if (!this.movieId) return;

    this.moviesService.getMovieById(this.movieId).subscribe(
      (movie) => {
        this.movie = movie;
        if (movie.trailer) {
          this.trailerLink = 'https://www.youtube.com/embed/' + AppUtils.getYouTubeId(movie.trailer);
        }
      },
      (error) => {
        this._snackbar.open('Error loading the movie', undefined, AppUtils.snackBarErrorConfig);
      }
    );
  }

  private loadUserInteractions(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user && this.movieId) {
        const userId = user.uid;

        this.votesService.getVoteByUserAndMovie(userId, this.movieId).subscribe(
          (vote) => {
            this.userVote = vote || null;
          },
          (error) => {
            console.error('Error fetching user vote:', error);
          }
        );

        this.userMoviesService.getUserMovie(userId, this.movieId).subscribe(
          (userMovie) => {
            this.userMovie = userMovie;
          },
          (error) => {
            console.error('Error fetching user movie:', error);
            this.userMovie = null;
          }
        );
      }
    });
  }

  vote(type: 'like' | 'dislike', movieId: string | undefined): void {
    if (!movieId) return;

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.votesService.addOrUpdateVote({
          userId: user.uid,
          movieId,
          voteType: type,
          createdAt: new Date().toISOString(),
        }).subscribe(
          () => {
            this._snackbar.open('Vote recorded!', undefined, { duration: 3000 });
            this.loadUserInteractions(); // Recargar los datos del usuario
          },
          (error) => {
            console.error('Error recording vote:', error);
          }
        );
      } else {
        this._snackbar.open('You must be logged in to vote', undefined, { duration: 3000 });
      }
    });
  }

  markAsWatched(movieId: string | undefined): void {
    if (!movieId) return;

    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        this._snackbar.open('You must be logged in to mark as watched', undefined, { duration: 3000 });
        return;
      }

      const userMovie: Omit<UserMovie, 'id'> = {
        userId: user.uid,
        movieId,
        status: 'watched',
        hasVoted: true,
        createdAt: new Date().toISOString(),
      };

      this.userMoviesService.addOrUpdateUserMovie(userMovie).subscribe({
        next: () => {
          this._snackbar.open('Movie marked as watched', undefined, { duration: 3000 });
          this.loadUserInteractions(); // Recargar los datos del usuario
        },
        error: (err) => {
          console.error('Error marking as watched:', err);
          this._snackbar.open('Error marking as watched', undefined, { duration: 3000 });
        },
      });
    });
  }

  markAsVoting(movieId: string | undefined): void {
    if (!movieId) return;

    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        this._snackbar.open('You must be logged in to mark as not watched', undefined, { duration: 3000 });
        return;
      }

      const userMovie: Omit<UserMovie, 'id'> = {
        userId: user.uid,
        movieId,
        status: 'voting',
        hasVoted: true,
        createdAt: new Date().toISOString(),
      };

      this.userMoviesService.addOrUpdateUserMovie(userMovie).subscribe({
        next: () => {
          this._snackbar.open('Movie marked as not watched', undefined, { duration: 3000 });
          this.loadUserInteractions(); // Recargar los datos del usuario
        },
        error: (err) => {
          console.error('Error marking as not watched:', err);
          this._snackbar.open('Error marking as not watched', undefined, { duration: 3000 });
        },
      });
    });
  }

  rateMovie(movieId: string | undefined, rating: number): void {
    if (!movieId || !this.movie) return;
  
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        this._snackbar.open('You must be logged in to rate', undefined, { duration: 3000 });
        return;
      }
  
      // Verificar la valoración previa
      this.userMoviesService.getUserMovie(user.uid, movieId).subscribe((existingUserMovie) => {
        const previousRating = existingUserMovie?.rating || 0;
  
        const userMovie: Omit<UserMovie, 'id'> = {
          userId: user.uid,
          movieId,
          status: 'watched',
          hasVoted: true,
          rating,
          createdAt: existingUserMovie?.createdAt || new Date().toISOString(),
        };
  
        // Actualizar o agregar la nueva valoración
        this.userMoviesService.addOrUpdateUserMovie(userMovie).subscribe({
          next: () => {
            this._snackbar.open('Movie rated successfully', undefined, { duration: 3000 });
  
            // Actualizar géneros preferidos del usuario
            if (this.movie?.genre) {
              this.updateLikedGenres(user.uid, this.movie.genre, previousRating, rating);
            }
  
            this.loadUserInteractions(); // Recargar los datos del usuario
          },
          error: (err) => {
            console.error('Error rating movie:', err);
            this._snackbar.open('Error rating movie', undefined, { duration: 3000 });
          },
        });
      });
    });
  }

  private updateLikedGenres(userId: string, genre: string, previousRating: number, newRating: number): void {
    this.usersService.getUserById(userId)
      .pipe(
        take(1), // Tomamos solo un valor de la suscripción
        map((user) => {
          if (!user) {
            throw new Error('User not found');
          }
  
          const likedGenres = user.likedGenres || {};
  
          // Restar la valoración anterior
          likedGenres[genre] = (likedGenres[genre] || 0) - previousRating;
  
          // Evitar valores negativos
          likedGenres[genre] = Math.max(0, likedGenres[genre]);
  
          // Sumar la nueva valoración
          likedGenres[genre] += newRating;
  
          return likedGenres;
        }),
        switchMap((updatedLikedGenres) => {
          // Actualizar los géneros preferidos
          return this.usersService.updateUser(userId, { likedGenres: updatedLikedGenres });
        })
      )
      .subscribe({
        next: () => {
          console.log(`Liked genres updated successfully for user ${userId}`);
        },
        error: (err) => {
          console.error('Error updating liked genres:', err);
        },
      });
  }
}
