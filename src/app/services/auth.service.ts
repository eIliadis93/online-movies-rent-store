import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/auth/login/`, { username, password })
      .pipe(
        tap((response) => {
          if (response && response.access && response.refresh) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            localStorage.setItem('username', username);

            if (username === 'deuscand5admin') {
              localStorage.setItem('user_role', 'admin');
            } else {
              localStorage.setItem('user_role', 'user');
            }
          } else {
            throw new Error('Invalid response from server');
          }
        })
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<any>(`${this.baseUrl}/auth/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response) => {
          if (response && response.access) {
            localStorage.setItem('access_token', response.access);
          } else {
            this.logout();
            throw new Error('Invalid response from server');
          }
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
