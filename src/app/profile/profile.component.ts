import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Profile } from '../interface/profile';
import { Rental } from '../interface/rental';
import { ProfileService } from '../services/profile.service';
import { RentalService } from '../services/rental.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: Profile = {} as Profile;
  isEditingWallet = false;
  walletBalance!: number;
  displayedColumns: string[] = [
    'uuid',
    'rental_date',
    'return_date',
    'is_paid',
    'movie',
  ];
  rentals: Rental[] = [];

  constructor(
    private profileService: ProfileService,
    private rentalService: RentalService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadUserRentals();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.walletBalance = profile.wallet;
    });
  }

  loadUserRentals(): void {
    this.rentalService.getUserRentals().subscribe((rentals) => {
      this.rentals = rentals.results;
      this.cdRef.detectChanges();
    });
  }

  returnMovie(rentalUuid: string): void {
    this.rentalService.returnMovie(rentalUuid).subscribe({
      next: (response) => {
        alert('Movie returned successfully!');
        this.loadUserRentals();
      },
      error: (error) => {
        alert('Error returning movie.');
      },
    });
  }
}
