import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AdminRentalsComponent } from './admin-rentals/admin-rentals.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieListComponent } from './movies/movies.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'movies', component: MovieListComponent, canActivate: [AuthGuard] },
  {
    path: 'movie/:id',
    component: MovieDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-rentals',
    component: AdminRentalsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'add-movie', component: AddMovieComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/movies', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/movies' }, // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
