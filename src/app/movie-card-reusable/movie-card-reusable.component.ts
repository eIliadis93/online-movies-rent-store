import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../interface/movie';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-movie-card-reusable',
  templateUrl: './movie-card-reusable.component.html',
  styleUrls: ['./movie-card-reusable.component.scss'],
})
export class MovieCardReusableComponent implements OnInit {
  @Input() movie?: Movie;
  @Input() isDetailsView: boolean = false;

  constructor(private router: Router, private rentalService: RentalService) {}

  ngOnInit(): void {}

  viewDetails(): void {
    if (!this.isDetailsView) this.router.navigate(['/movie', this.movie?.uuid]);
  }

  rentMovie(): void {
    if (this.movie)
      this.rentalService.rentMovie(this.movie.uuid).subscribe({
        next: (response) => {
          alert('Movie rented successfully!');
        },
        error: (error) => {
          alert('You rented that movie already.');
        },
      });
  }
}
