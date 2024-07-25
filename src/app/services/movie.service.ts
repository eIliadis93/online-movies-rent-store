import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie, MovieCreate } from '../interface/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMovies(
    page: number = 1,
    pageSize: number = 10,
  ): Observable<Movie[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<Movie[]>(`${this.baseUrl}/rent-store/movies/`, { params });
  }

  getMovieById(movieUuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rent-store/movies/${movieUuid}`);
  }

  addMovie(movie: MovieCreate): Observable<MovieCreate> {
    return this.http.post<MovieCreate>(`${this.baseUrl}/rent-store/movies/`, movie);
  }
}
