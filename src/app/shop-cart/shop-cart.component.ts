import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CartService } from './services/cart/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Cart } from './services/cart/cart';
import { PromoDiscountPipe } from './pipe/promo-discount.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    PromoDiscountPipe,
    FormsModule,
  ],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCartComponent implements OnInit {
  private router = inject(Router);

  private cartService = inject(CartService);
  displayedColumns: string[] = ['movie', 'title', 'price', 'quantity'];
  displayedColumnsDiscount: string[] = ['title', 'price', 'quantity', 'total'];
  public dataSource = this.cartService.userCartArray$;
  public moviesInPromotion = signal<Cart[]>([]);
  public totalPrice = signal<number>(0);
  allMovies = signal<Cart[]>([]);

  ngOnInit(): void {
    this.cartService.userCartArray$.subscribe((movies) => {
      this.allMovies.set(movies);
      this.sumTotalWithDiscounts(movies);
    });
  }
  goBack() {
    this.router.navigate(['/home']);
  }

  sumTotalWithDiscounts(movies: Cart[]) {
    let totalPriceMoviesDiscounts = 0;
    let totalOtherMovies = 0;

    let moviesInPromo = movies.filter((res) => res.product.id <= 3);
    let moviesWithoutPromo = movies.filter((res) => res.product.id > 3);

    this.moviesInPromotion.set(moviesInPromo);
    this.moviesInPromotion().forEach(
      (res) => (totalPriceMoviesDiscounts += res.product.price * res.quantity)
    );
    if (this.moviesInPromotion().length == 2) {
      totalPriceMoviesDiscounts = totalPriceMoviesDiscounts * 0.9;
    } else if (this.moviesInPromotion().length == 3) {
      totalPriceMoviesDiscounts = totalPriceMoviesDiscounts * 0.8;
    }

    moviesWithoutPromo.forEach((val) => {
      totalOtherMovies += val.product.price * val.quantity;
    });

    this.totalPrice.set(totalPriceMoviesDiscounts + totalOtherMovies);
  }

  addOrRemoveProduct(idProduct: number, add: boolean) {
    let filteredMovie = this.allMovies().filter(
      (val) => val.product.id == idProduct
    );
    let findIndex = this.allMovies().findIndex(
      (res) => res.product.id == idProduct
    );
    let moviesToChange = this.allMovies();
    if (add) {
      if (filteredMovie[0].quantity > 0 && filteredMovie[0].quantity < 10) {
        filteredMovie[0].quantity += 1;
      }
    } else {
      if (filteredMovie[0].quantity > 1) {
        filteredMovie[0].quantity -= 1;
      } else if (filteredMovie[0].quantity == 1) {
        filteredMovie[0].quantity = 0;
      }
    }

    if (filteredMovie[0].quantity == 0) {
      moviesToChange.splice(findIndex, 1);
    } else {
      moviesToChange[findIndex] = filteredMovie[0];
    }

    this.allMovies.set(moviesToChange);
    this.cartService.changeCartQuantity(this.allMovies());
  }
}
