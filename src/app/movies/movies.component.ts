import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MovieService } from '../services/movie.service';
import { Movie } from '../interface/movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getAllMovies().subscribe(
      (response: any) => {
        this.movies = response.results;
      },
      (error) => {
        console.error('Failed to fetch movies', error);
      }
    );
  }
}
