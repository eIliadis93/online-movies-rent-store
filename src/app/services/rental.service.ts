import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rental, RentalsResponse } from '../interface/rental';
import { Movie } from '../interface/movie';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllRentals(page: number, pageSize: number): Observable<RentalsResponse> {
    return this.http.get<RentalsResponse>(`${this.baseUrl}/rent-store/rentals/`, {
      params: {
        page: page.toString(),
        page_size: pageSize.toString(),
      },
    });
  }

  rentMovie(movieUuid: string): Observable<Movie> {
    return this.http.post<Movie>(`${this.baseUrl}/rent-store/rentals/`, { movie: movieUuid });
  }

  returnMovie(rentalUuid: string): Observable<RentalsResponse> {
    return this.http.patch<RentalsResponse>(`${this.baseUrl}/rent-store/rentals/${rentalUuid}`, {});
  }
}
