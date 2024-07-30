import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../interface/movie';
import { RentalsResponse } from '../interface/rental';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRentals(
    page: number,
    pageSize: number,
    onlyActive: boolean
  ): Observable<RentalsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    if (onlyActive) {
      params = params.set('only-active', 'true');
    }

    return this.http.get<RentalsResponse>(
      `${this.baseUrl}/rent-store/rentals/`,
      { params }
    );
  }

  rentMovie(movieUuid: string): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/rent-store/rentals/`, {
      movie: movieUuid,
    });
  }

  returnMovie(rentalUuid: string): Observable<RentalsResponse> {
    return this.http.patch<RentalsResponse>(
      `${this.baseUrl}/rent-store/rentals/${rentalUuid}`,
      {}
    );
  }
}
