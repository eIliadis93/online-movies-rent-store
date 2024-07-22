import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AdminRentalsComponent } from './admin-rentals/admin-rentals.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'movies', component: MovieListComponent, canActivate: [AuthGuard] },
  { path: 'movies/:id', component: MovieListComponent, canActivate: [AuthGuard] },
  { path: 'user-rentals', component: AdminRentalsComponent, canActivate: [AuthGuard] },
  { path: 'admin/add-movie', component: AddMovieComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: '**', redirectTo: '/movies' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
