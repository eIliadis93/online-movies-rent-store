import { Component, OnInit } from '@angular/core';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-admin-rentals',
  templateUrl: './admin-rentals.component.html',
  styleUrls: ['./admin-rentals.component.scss']
})
export class AdminRentalsComponent implements OnInit {
  rentals: any[] = [];

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    this.rentalService.getAllRentals().subscribe(rentals => {
      this.rentals = rentals;
    });
  }
}
