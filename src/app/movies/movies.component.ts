import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MovieService } from '../services/movie.service';
import { AlertService } from '../services/alert.service';
import { Movie, Category } from '../interface/movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  categories: Category[] = [];
  totalMovies = 0;
  pageSize = 10;
  pageIndex = 0;
  selectedCategory: string = '';
  fromRating: number | null = null;
  toRating: number | null = null;
  fromYear: number | null = null;
  toYear: number | null = null;
  pageSizeOptions = [10, 25, 50, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private movieService: MovieService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getMovies(
      this.pageIndex + 1,
      this.pageSize,
      this.selectedCategory,
      this.fromRating,
      this.toRating,
      this.fromYear,
      this.toYear
    ).subscribe(
      (response: any) => {
        this.movies = response.results;
        this.totalMovies = response.count;
        this.paginator.length = this.totalMovies;
      },
      (error) => {
        if (error.status === 404) {
          this.alertService.openAlert({
            type: 'alert',
            title: 'No Movies Found',
            message: 'There are no movies available with the current filters.',
          });
          this.movies = [];
          this.totalMovies = 0;
          this.paginator.length = 0;
        } else {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'Failed to fetch movies.',
          });
        }
      }
    );
  }

  fetchCategories(): void {
    this.movieService.getCategories().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
        this.alertService.openAlert({
          type: 'alert',
          title: 'Error',
          message: 'Failed to fetch categories.',
        });
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchMovies();
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.value;
    this.pageIndex = 0;
    this.fetchMovies();
  }

  onFromRatingChange(event: any): void {
    this.fromRating = event.target.value ? Number(event.target.value) : null;
    this.pageIndex = 0;
    this.fetchMovies();
  }

  onToRatingChange(event: any): void {
    this.toRating = event.target.value ? Number(event.target.value) : null;
    this.pageIndex = 0;
    this.fetchMovies();
  }

  onFromYearChange(event: any): void {
    this.fromYear = event.target.value ? Number(event.target.value) : null;
    this.pageIndex = 0;
    this.fetchMovies();
  }

  onToYearChange(event: any): void {
    this.toYear = event.target.value ? Number(event.target.value) : null;
    this.pageIndex = 0;
    this.fetchMovies();
  }
}
