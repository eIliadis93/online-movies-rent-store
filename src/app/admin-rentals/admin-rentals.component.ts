import { Component, OnInit } from '@angular/core';
import { Rental } from '../interface/rental';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-admin-rentals',
  templateUrl: './admin-rentals.component.html',
  styleUrls: ['./admin-rentals.component.scss'],
})
export class AdminRentalsComponent implements OnInit {
  rentals: Rental[] = [];

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    
  }
}
