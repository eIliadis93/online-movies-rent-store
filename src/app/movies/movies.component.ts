import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Movie } from '../interface/movie';
import { MovieService } from '../services/movie.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  totalMovies = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private movieService: MovieService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getMovies(this.pageIndex + 1, this.pageSize).subscribe(
      (response: any) => {
        console.log('Movies fetched:', response); // Add this line to debug
        this.movies = response.results;
        this.totalMovies = response.count; // Assuming `count` is the total number of movies
      },
      (error) => {
        console.error('Error fetching movies:', error); // Add this line to debug
        this.alertService.openAlert({
          type: 'alert',
          title: 'Error',
          message: 'Failed to fetch movies.',
        });
      }
    );
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchMovies();
  }
}
