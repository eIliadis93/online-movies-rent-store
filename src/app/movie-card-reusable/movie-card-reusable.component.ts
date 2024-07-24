import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../interface/movie';

@Component({
  selector: 'app-movie-card-reusable',
  templateUrl: './movie-card-reusable.component.html',
  styleUrls: ['./movie-card-reusable.component.scss'],
})
export class MovieCardReusableComponent implements OnInit {
  @Input() movie!: Movie;
  @Input() isDetailsView: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewDetails(movieId: string): void {
   if(!this.isDetailsView)this.router.navigate(['/movie', movieId]);
  }

  rentMovie(event: Event): void {
    event.stopPropagation();
    console.log('Renting movie:', this.movie.title);
  }
}
