import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { AlertService } from '../services/alert.service';
import { Category } from '../interface/movie';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  movieForm!: FormGroup;
  categoryCtrl: FormControl;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.categoryCtrl = new FormControl('');
  }

  ngOnInit(): void {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      pub_date: [null],
      duration: [null],
      rating: [null],
      description: [''],
      categories: this.fb.array([]),
    });
  }

  addCategory(event: any): void {
    const input = event.input;
    const value = event.value.trim();

    if (value && !this.movieForm.value.categories.includes(value)) {
      this.movieForm.value.categories.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  removeCategory(category: string): void {
    const categories = this.movieForm.value.categories as string[];
    const index = categories.indexOf(category);

    if (index >= 0) {
      categories.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      this.movieService.addMovie(this.movieForm.value).subscribe(
        () => {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Success',
            message: 'Movie added successfully!'
          });
          this.resetForm();
        },
        (error) => {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'Failed to add movie.'
          });
        }
      );
    }
  }

  resetForm(): void {
    this.movieForm.reset();
    this.categoryCtrl.reset();
  }
}
