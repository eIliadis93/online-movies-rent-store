import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Profile } from '../interface/profile';
import { Rental, RentalsResponse } from '../interface/rental';
import { ProfileService } from '../services/profile.service';
import { RentalService } from '../services/rental.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('addFundsDialog') addFundsDialog!: TemplateRef<any>;
  profile: Profile = {} as Profile;
  isEditingWallet = false;
  walletBalance!: number;
  funds: number = 0;
  displayedColumns: string[] = [
    'uuid',
    'rental_date',
    'return_date',
    'is_paid',
    'movie',
    'actions'
  ];
  dataSource = new MatTableDataSource<Rental>();
  totalRentals = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private profileService: ProfileService,
    private rentalService: RentalService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.walletBalance = profile.wallet;
      this.loadUserRentals();
    });
  }

  loadUserRentals(): void {
    if (this.paginator) {
      const page = this.paginator.pageIndex + 1; // MatPaginator is 0-based
      const pageSize = this.paginator.pageSize;

      this.fetchRentals(page, pageSize).pipe(
        tap((response) => {
          this.totalRentals = response.count;
          const filteredRentals = response.results.filter(
            (rental) => rental.user === this.profile.email
          );
          this.dataSource.data = filteredRentals;
          this.cdRef.detectChanges();
        })
      ).subscribe();
    }
  }

  fetchRentals(page: number, pageSize: number): Observable<RentalsResponse> {
    return this.rentalService.getAllRentals(page, pageSize);
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

  async openAddFundsDialog(): Promise<void> {
    const funds = await this.alertService.openAddFundsDialog();
    if (funds) {
      this.profileService.updateProfile({ deposit: funds }).subscribe({
        next: (response) => {
          this.profile.wallet += funds;
          this.loadProfile();
        },
        error: (error) => {
          console.error('Error adding funds:', error);
        }
      });
    }
  }
}
