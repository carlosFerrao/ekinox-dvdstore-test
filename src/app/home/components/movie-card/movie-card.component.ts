import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../services/movies/movie';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../shop-cart/services/cart/cart.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardComponent {
  private cartService = inject(CartService);
  public movieInfo = input.required<Movie>();

  addNewItemToCart(movie: Movie) {
    this.cartService.setItemToCart(movie);
  }
}
