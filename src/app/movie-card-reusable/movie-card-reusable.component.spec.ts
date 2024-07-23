import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCardReusableComponent } from './movie-card-reusable.component';

describe('MovieCardReusableComponent', () => {
  let component: MovieCardReusableComponent;
  let fixture: ComponentFixture<MovieCardReusableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieCardReusableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieCardReusableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
