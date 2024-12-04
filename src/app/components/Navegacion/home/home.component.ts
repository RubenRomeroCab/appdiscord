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
import { UserMoviesService } from '../../../services/user-movies.service';

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
    private userMoviesService: UserMoviesService,
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
    // Si no hay usuarios seleccionados, vaciar las recomendaciones y salir
    if (this.selectedUsers.size === 0) {
      this.recommendedMovies = []; // Vaciar la lista de recomendaciones
      return; // Salir de la función
    }

    // Convertimos los IDs de los usuarios seleccionados en un array
    const userIds = Array.from(this.selectedUsers);

    // Promesa para obtener todos los votos y películas vistas de los usuarios seleccionados
    Promise.all(
      userIds.map((userId) =>
        Promise.all([
          // Obtener los votos de cada usuario
          firstValueFrom(this.votesService.getVotesByUser(userId)),
          // Obtener las películas relacionadas con el usuario
          firstValueFrom(this.userMoviesService.getUserMoviesByUserId(userId)),
        ]).then(([votes, userMovies]) => ({
          userId,
          votes, // Lista de votos del usuario
          // Filtrar las películas con status 'watched' y extraer sus IDs
          watchedMovies: userMovies
            .filter((um) => um.status === 'watched')
            .map((um) => um.movieId),
        }))
      )
    )
      .then((userData) => {
        /**
         * Combinar todos los votos de los usuarios en un único objeto
         * - Cada película tendrá una puntuación acumulada según los votos.
         * - Los "likes" suman 10 puntos, los "dislikes" restan 10 puntos.
         */
        const voteScores = userData.flatMap((data) => data.votes).reduce((acc, vote) => {
          acc[vote.movieId] = (acc[vote.movieId] || 0) + (vote.voteType === 'like' ? 10 : -10);
          return acc; // Devolvemos el objeto acumulado
        }, {} as Record<string, number>);

        // Reducir puntos para las películas marcadas como "watched"
        userData.forEach((data) => {
          data.watchedMovies.forEach((movieId) => {
            voteScores[movieId] = (voteScores[movieId] || 0) - 10; // Restar 10 puntos a las películas vistas
          });
        });

        // Obtener todas las películas disponibles en la base de datos
        this.moviesService.getAllMovies().subscribe((movies) => {
          /**
           * Para cada película, calculamos su puntuación combinando:
           * - Los votos recibidos (likes/dislikes).
           * - La reputación del usuario que propuso la película.
           */
          const movieScorePromises = movies.map((movie) =>
            // Calculamos la reputación del usuario que propuso la película
            firstValueFrom(this.usersService.calculateReputation(movie.proposerId)).then((reputation) => ({
              movie, // Detalles de la película
              score: voteScores[movie.id || ''] || 0, // Puntuación calculada a partir de los votos y status
              proposerReputation: reputation || 0, // Reputación del proponente
            }))
          );

          // Procesar las películas con sus puntuaciones calculadas
          Promise.all(movieScorePromises).then((scoredMovies) => {
            /**
             * Ordenar las películas de mayor a menor puntaje:
             * 1. Por puntaje total (likes/dislikes).
             * 2. En caso de empate, por la reputación del proponente.
             */
            const sortedMovies = scoredMovies.sort((a, b) => {
              if (b.score === a.score) {
                // Si los puntajes son iguales, usamos la reputación como desempate
                return b.proposerReputation - a.proposerReputation;
              }
              return b.score - a.score; // Ordenar de mayor a menor por puntaje
            });

            /**
             * Si la lista de películas es vacía o todos los puntajes son negativos:
             * - Mostrar la película con el mayor puntaje negativo o la mejor disponible.
             */
            if (sortedMovies.length === 0 || sortedMovies.every((item) => item.score <= 0)) {
              const bestMovie = sortedMovies[0]; // La primera película ordenada
              this.recommendedMovies = bestMovie
                ? [new ScoredMovie({ ...bestMovie.movie, score: bestMovie.score })]
                : [];
            } else {
              // Si hay películas con puntajes positivos:
              // - Seleccionamos hasta un máximo de 5 películas para mostrar
              const maxMoviesToShow = 5;
              this.recommendedMovies = sortedMovies
                .filter((item) => item.score > 0)
                .slice(0, maxMoviesToShow) // Limitar la cantidad de resultados
                .map((item) => new ScoredMovie({ ...item.movie, score: item.score })); // Crear objetos ScoredMovie
            }
          });
        });
      })
      .catch((error) => {
        // Manejo de errores si algo falla durante el proceso
        console.error('Error generating recommendations:', error);
      });
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = '/default-image.png'; // Ruta de la imagen por defecto
  }
}
