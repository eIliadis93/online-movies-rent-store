import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap, BehaviorSubject, switchMap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing = false;
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatusChange = this.loginStatus.asObservable();
  private isAdmin = new BehaviorSubject<boolean>(this.checkAdmin());

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
              this.isAdmin.next(true);
            } else {
              localStorage.setItem('user_role', 'user');
              this.isAdmin.next(false);
            }
            this.loginStatus.next(true);
          } else {
            throw new Error('Invalid response from server');
          }
        })
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable();
    } else {
      this.isRefreshing = true;
      return this.http
        .post<any>(`${this.baseUrl}/auth/refresh/`, { refresh: refreshToken })
        .pipe(
          tap((response) => {
            if (response && response.access) {
              localStorage.setItem('access_token', response.access);
              this.refreshTokenSubject.next(response.access);
            } else {
              this.logout();
              throw new Error('Invalid response from server');
            }
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.logout();
            return throwError(error);
          }),
          switchMap(() => this.refreshTokenSubject.asObservable())
        );
    }
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
    this.loginStatus.next(false);
    this.isAdmin.next(false);
    this.router.navigate(['/login']);
  }

  isAdminUser(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  private checkAdmin(): boolean {
    return localStorage.getItem('user_role') === 'admin';
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
