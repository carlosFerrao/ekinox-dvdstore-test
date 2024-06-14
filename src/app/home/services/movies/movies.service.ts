import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from './movie';
import { moviesMock } from './movie-mock';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  movies$ = new BehaviorSubject<Movie[]>(moviesMock);
}
