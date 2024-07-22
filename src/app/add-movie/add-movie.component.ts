import { Component } from '@angular/core';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent {
  constructor(private movieService: MovieService) {}

  addMovie(movie: any) {
    this.movieService.addMovie(movie).subscribe(response => {
      // Handle add movie response
      console.log("response: ", response);
    });
  }
}
