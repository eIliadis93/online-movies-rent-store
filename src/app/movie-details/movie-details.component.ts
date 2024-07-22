import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: any;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieUuid = this.route.snapshot.paramMap.get('id');
    if (movieUuid) {
      this.movieService.getMovieById(movieUuid).subscribe(
        movie => {
          this.movie = movie;
        },
        error => {
          console.error('Error fetching movie details', error);
          this.router.navigate(['/movies']);
        }
      );
    } else {
      console.error('Movie UUID is null');
      this.router.navigate(['/movies']);
    }
  }
}
