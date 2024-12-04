export class Movie {
    id?: string; // Firestore document ID
    name: string;
    description: string;
    image?: string;
    trailer?: string;
    genre: string;
    proposerId: string;
    createdAt: string;

    static genres: string[] = [
      'Comedia',
      'Drama',
      'Acción',
      'Thriller',
      'Romance',
      'Terror',
      'Ciencia Ficción',
      'Aventura',
      'Fantasía',
      'Animación',
      'Documental',
      'Biografía',
      'Histórico',
      'Bélico',
      'Misterio',
      'Musical',
      'Western',
      'Deportes',
      'Policíaco',
      'Superhéroes',
      'Infantil',
      'Noir',
      'Suspense',
      'Cine Negro',
      'Cine Mudo',
      'Cine Independiente',
      'Experimental',
      'Cine de Autor',
      'Ciencia',
      'Drama Deportivo',
      'Comedia Romántica',
      'Melodrama',
      'Fantástico',
      'Espionaje',
      'Cine Catástrofe',
      'Cine Épico',
      'Cine Social',
      'Cine Religioso',
      'Cine Experimental',
      'Reality Show',
      'Telenovela',
      'Sitcom',
      'Drama Médico',
      'Drama Jurídico',
      'Thriller Psicológico',
      'Cyberpunk',
      'Steampunk',
      'Horror Cósmico',
      'Survival',
      'Distopía',
      'Utopía',
      'Ciencia Natural',
      'Viajes en el Tiempo',
      'Animación para Adultos',
      'Comedia Negra'
    ];
  
    constructor(data: Partial<Movie>) {
      this.name = data.name || '';
      this.description = data.description || '';
      this.image = data.image || '';
      this.trailer = data.trailer || '';
      this.genre = data.genre || '';
      this.proposerId = data.proposerId || '';
      this.createdAt = data.createdAt || new Date().toISOString();
    }
  
    /**
     * Prepare the data for Firestore (removes the `id` field).
     * @returns A plain object without `id`.
     */
    toFirestore(): Omit<Movie, 'id'> {
      const { id, ...data } = this;
      return data as Omit<Movie, 'id'>;
    }
  
    /**
     * Convert Firestore document data into a Movie instance.
     * @param id - Firestore document ID.
     * @param data - Firestore document data.
     * @returns A new Movie instance.
     */
    static fromFirestore(id: string, data: Partial<Movie>): Movie {
      const movie = new Movie(data); // Ensure proposerId exists in the data
      movie.id = id;
      return movie;
    }
  }