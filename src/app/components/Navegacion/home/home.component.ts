import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../../services/movies.service';
import { AppUser } from '../../../models/appuser.model';
import { UsersService } from '../../../services/users.service';
import { AppUtils } from '../../../utils/AppUtils';
import { Movie } from '../../../models/movie.model';
import { firstValueFrom } from 'rxjs';
import { VotesService } from '../../../services/votes.service';

export class ScoredMovie extends Movie {
  score: number;


  constructor(data: Partial<ScoredMovie>) {
    super(data);
    this.score = data.score || 0;
    this.id = data.id;
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  user!: any; // Authenticated user, replace with your user model
  recommendedMovies: ScoredMovie[] = [];
  users: AppUser[] = []; // List of all users
  selectedUsers: Set<string> = new Set(); // Track selected user IDs


  AppUtils = AppUtils;

  constructor(
    private userService: UsersService,
    private moviesService: MoviesService,
    private usersService: UsersService,
    private votesService: VotesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSelectedUsers();
    this.loadUsers();
    this.generateRecommendations();
    
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  toggleUserSelection(userId: string): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId); // Deselect user
    } else {
      this.selectedUsers.add(userId); // Select user
    }
    this.saveSelectedUsers(); // Guardar la selección
    this.generateRecommendations();
  }

  isUserSelected(userId: string): boolean {
    return this.selectedUsers.has(userId);
  }

  showMovieDetail(idMovie: string | undefined): void {
    this.router.navigate([`/pelicula-detail/${idMovie}`]);
  }

  saveSelectedUsers(): void {
    localStorage.setItem('selectedUsers', JSON.stringify(Array.from(this.selectedUsers)));
  }

  loadSelectedUsers(): void {
    const storedUsers = localStorage.getItem('selectedUsers');
    if (storedUsers) {
      this.selectedUsers = new Set(JSON.parse(storedUsers));
    }
  }

  generateRecommendations(): void {
    if (this.selectedUsers.size === 0) {
      this.recommendedMovies = [];
      return;
    }
  
    const userIds = Array.from(this.selectedUsers);
  
    // Obtener preferencias de género y votos de los usuarios seleccionados
    Promise.all([
      Promise.all(
        userIds.map((userId) =>
          firstValueFrom(
            this.usersService.getUserById(userId)
          ).then((user) => ({
            userId,
            likedGenres: user?.likedGenres || {},
          }))
        )
      ),
      Promise.all(
        userIds.map((userId) =>
          firstValueFrom(
            this.votesService.getVotesByUser(userId) // Nueva función para obtener votos por usuario
          )
        )
      ),
    ])
      .then(([userPreferences, userVotes]) => {
        // Combinar las preferencias de género
        const genreScores = userPreferences.reduce((acc, { likedGenres }) => {
          for (const genre in likedGenres) {
            acc[genre] = (acc[genre] || 0) + likedGenres[genre];
          }
          return acc;
        }, {} as Record<string, number>);
  
        // Combinar los votos
        const voteScores = userVotes.flat().reduce((acc, vote) => {
          acc[vote.movieId] = (acc[vote.movieId] || 0) + (vote.voteType === 'like' ? 10 : -10);
          return acc;
        }, {} as Record<string, number>);
  
        // Obtener todas las películas
        this.moviesService.getAllMovies().subscribe((movies) => {
         
  
          
          // Crear instancias de ScoredMovie con la combinación de puntuaciones
          const scoredMovies = movies.map((movie) => {
            const voteScore = voteScores[movie.id || ''] || 0;
            const genreScore = genreScores[movie.genre] || 0;
  
            // Ponderar votos (70%) y géneros (30%)
            const totalScore = 0.7 * voteScore + 0.3 * genreScore;
  
            return new ScoredMovie({ ...movie, score: totalScore });
          });
  
          // Obtener el puntaje más alto
          const maxScore = Math.max(...scoredMovies.map((movie) => movie.score), 0);
  
          // Filtrar películas con el puntaje más alto
          const bestMovies = scoredMovies.filter((movie) => movie.score === maxScore);
  
          // Limitar el número de películas si es necesario
          const maxMoviesToShow = 5;
          this.recommendedMovies = bestMovies.slice(0, maxMoviesToShow);
        });
      })
      .catch((error) => {
        console.error('Error generating recommendations:', error);
      });
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/default-image.png'; // Ruta de la imagen por defecto
  }
}
