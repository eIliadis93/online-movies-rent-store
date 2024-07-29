import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Category, Movie, MovieCreate } from '../interface/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMovies(
    page: number = 1,
    pageSize: number = 10,
    category: string = '',
    fromRating: number | null = null,
    toRating: number | null = null,
    fromYear: number | null = null,
    toYear: number | null = null
  ): Observable<ApiResponse<Movie>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (category) params = params.set('category', category);
    if (fromRating !== null)
      params = params.set('from-rating', fromRating.toString());
    if (toRating !== null)
      params = params.set('to-rating', toRating.toString());
    if (fromYear !== null)
      params = params.set('from-year', fromYear.toString());
    if (toYear !== null) params = params.set('to-year', toYear.toString());

    return this.http.get<ApiResponse<Movie>>(
      `${this.baseUrl}/rent-store/movies/`,
      { params }
    );
  }

  getMovieById(movieUuid: string): Observable<Movie> {
    return this.http.get<Movie>(
      `${this.baseUrl}/rent-store/movies/${movieUuid}`
    );
  }

  addMovie(movie: MovieCreate): Observable<MovieCreate> {
    return this.http.post<MovieCreate>(
      `${this.baseUrl}/rent-store/movies/`,
      movie
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/rent-store/categories/`);
  }

  getMoviesAll(pageSize: number = 100): Observable<Movie[]> {
    const fetchPage = (page: number): Observable<Movie[]> => {
      return this.getMovies(page, pageSize).pipe(
        switchMap((response) => {
          const movies: Movie[] = response.results;
          if (response.next) {
            const nextPage =
              new URL(response.next).searchParams.get('page') || '1';
            return fetchPage(Number(nextPage)).pipe(
              map((nextMovies) => [...movies, ...nextMovies])
            );
          } else {
            return of(movies);
          }
        }),
        catchError(() => of([] as Movie[]))
      );
    };

    return fetchPage(1);
  }
}
