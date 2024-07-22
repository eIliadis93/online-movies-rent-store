import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { AdminRentalsComponent } from './admin-rentals/admin-rentals.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from '../../auth.interceptor';

export function tokenGetter() {
  return localStorage.getItem('access_token') || ''; // Ensure it returns a string
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MovieListComponent,
    MovieDetailsComponent,
    AdminRentalsComponent,
    AddMovieComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter, // Use the tokenGetter function
        allowedDomains: ['3.235.214.44:8000'], // API domain
        disallowedRoutes: []
      }
    }),
    AppRoutingModule
  ],
  providers: [
    JwtHelperService, // Provide JwtHelperService
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Provide AuthInterceptor
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }