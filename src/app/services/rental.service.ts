import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllRentals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rent-store/rentals/`);
  }

  getUserRentals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rent-store/rentals/`);
  }

  rentMovie(movieUuid: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/rent-store/rentals/`, { movie: movieUuid });
  }

  returnMovie(rentalUuid: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/rent-store/rentals/${rentalUuid}`, {});
  }
}
