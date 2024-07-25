import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReusableComponent } from './dialog-reusable.component';

describe('DialogReusableComponent', () => {
  let component: DialogReusableComponent;
  let fixture: ComponentFixture<DialogReusableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReusableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogReusableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
