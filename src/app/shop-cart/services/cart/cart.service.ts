import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Cart } from './cart';
import { Movie } from '../../../home/services/movies/movie';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  userCartProducts$ = new BehaviorSubject<Cart[]>([]);
  userCartArray$ = this.userCartProducts$.asObservable();
  constructor(private router: Router, private _snackBar: MatSnackBar) {}

  setItemToCart(product: Movie) {
    this.userCartArray$.pipe(take(1)).subscribe((movies) => {
      let allMoviesFiltered = movies.filter(
        (res) => res.product.id == product.id
      );

      let findIndex = movies.findIndex((res) => res.product.id == product.id);

      if (allMoviesFiltered.length > 0) {
        if (movies[findIndex].quantity !== 10) {
          movies[findIndex].quantity += 1;
          this.userCartProducts$.next(movies);
        } else if (movies[findIndex].quantity == 10) {
          this._snackBar.open(
            'Maximum limit reached in cart ! (10 items)!',
            '',
            {
              duration: 2000,
            }
          );
          return;
        }
      } else {
        this.userCartProducts$.next([...movies, { product, quantity: 1 }]);
      }

      let snackBarRef = this._snackBar.open(
        'Movie added to Cart !',
        'Go to Cart',
        {
          duration: 2000,
        }
      );
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/cart']);
      });
    });
  }

  changeCartQuantity(cart: Cart[]) {
    this.userCartProducts$.next(cart);
  }
}
