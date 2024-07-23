import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../interface/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/rent-store/movies/`);
  }

  getMovieById(movieUuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rent-store/movies/${movieUuid}`);
  }

  addMovie(movie: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/rent-store/movies/`, movie);
  }
}
