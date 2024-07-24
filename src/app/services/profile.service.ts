import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profile, ProfileUpdate } from '../interface/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = `${environment.apiUrl}/rent-store/profile/`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.baseUrl);
  }

  updateProfile(profileUpdate: { deposit: number }): Observable<any> {
    return this.http.patch(this.baseUrl, profileUpdate);
  }
}
