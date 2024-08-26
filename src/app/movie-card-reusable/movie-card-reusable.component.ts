import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../interface/movie';
import { AlertService } from '../services/alert.service';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-movie-card-reusable',
  templateUrl: './movie-card-reusable.component.html',
  styleUrls: ['./movie-card-reusable.component.scss'],
})
export class MovieCardReusableComponent implements OnInit,OnChanges {
  @Input() movie?: Movie;
  @Input() isDetailsView: boolean = false;
  image?: string = '';

  constructor(
    private router: Router,
    private rentalService: RentalService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
      this.setImage();
  }

  viewDetails(): void {
    if (!this.isDetailsView) this.router.navigate(['/movie', this.movie?.uuid]);
  }

  rentMovie(): void {
    if (this.movie) {
      this.rentalService.rentMovie(this.movie.uuid).subscribe({
        next: (response) => {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Success',
            message: 'Movie rented successfully!',
          });
        },
        error: (error) => {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'You rented that movie already.',
          });
        },
      });
    }
  }

  setImage() {
    const defaultImage = 'https://img.freepik.com/free-vector/cinema-realistic-poster-with-illuminated-bucket-popcorn-drink-3d-glasses-reel-tickets-blue-background-with-tapes-vector-illustration_1284-77070.jpg';
  
    this.image = this.movie?.poster_url || defaultImage;
  
    const img = new Image();
    img.src = this.image;
  
    img.onerror = () => {
      this.image = defaultImage;
    };
  }  
}
