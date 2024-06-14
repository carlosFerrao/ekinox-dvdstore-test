import { Movie } from '../../../home/services/movies/movie';

export interface Cart {
  product: Movie;
  quantity: number;
}
