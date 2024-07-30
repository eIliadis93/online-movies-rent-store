import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../interface/movie';
import { AlertService } from '../services/alert.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
})
export class AddMovieComponent implements OnInit {
  movieForm!: FormGroup;
  availableCategories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      pub_date: [null],
      duration: [null],
      rating: [null],
      description: [''],
      categories: this.fb.array([]),
      categorySelect: [''],
    });

    this.fetchCategories();
  }

  get categories(): FormArray {
    return this.movieForm.get('categories') as FormArray;
  }

  fetchCategories(): void {
    this.movieService.getCategories().subscribe(
      (categories) => {
        this.availableCategories = categories;
      },
      (error) => {
        this.alertService.openAlert({
          type: 'alert',
          title: 'Error',
          message: 'Failed to fetch categories.',
        });
      }
    );
  }

  onCategorySelected(event: any): void {
    const selectedCategories = event.value;
    this.categories.clear();
    selectedCategories.forEach((category: string) => {
      this.categories.push(this.fb.control(category));
    });
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      const formValue = this.movieForm.value;
      formValue.categories = formValue.categorySelect;

      this.movieService.addMovie(formValue).subscribe(
        () => {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Success',
            message: 'Movie added successfully!',
          });
          this.resetForm();
        },
        (error) => {
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'Failed to add movie.',
          });
        }
      );
    }
  }

  resetForm(): void {
    this.movieForm.reset();
    this.categories.clear();
  }
}
