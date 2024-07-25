import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../interface/movie';
import { RentalService } from '../services/rental.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-movie-card-reusable',
  templateUrl: './movie-card-reusable.component.html',
  styleUrls: ['./movie-card-reusable.component.scss'],
})
export class MovieCardReusableComponent implements OnInit {
  @Input() movie?: Movie;
  @Input() isDetailsView: boolean = false;

  constructor(private router: Router, private rentalService: RentalService, private alertService: AlertService) {}

  ngOnInit(): void {}

  viewDetails(): void {
    if (!this.isDetailsView) this.router.navigate(['/movie', this.movie?.uuid]);
  }

  rentMovie(): void {
    if (this.movie) {
      this.rentalService.rentMovie(this.movie.uuid).subscribe({
        next: (response) => {
          // Open the reusable dialog
          this.alertService.openAlert({
            type: 'alert',
            title: 'Success',
            message: 'Movie rented successfully!'
          });
        },
        error: (error) => {
          // Open the reusable dialog for errors
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'You rented that movie already.'
          });
        },
      });
    }
  }
}
