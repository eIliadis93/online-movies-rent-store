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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  viewDetails(movieId: string): void {
    this.router.navigate(['/movie', movieId]);
  }
}
