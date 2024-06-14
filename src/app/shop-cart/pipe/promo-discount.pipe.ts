import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appPromoDiscount',
  standalone: true,
})
export class PromoDiscountPipe implements PipeTransform {
  transform(value: number, quantityMoviesPromo: number): number {
    let finalPrice = 0;
    if (quantityMoviesPromo == 2) {
      finalPrice = value * 0.9;
    } else if (quantityMoviesPromo == 3) {
      finalPrice = value * 0.8;
    }

    return finalPrice;
  }
}
