import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Profile } from '../interface/profile';
import { Rental, RentalsResponse } from '../interface/rental';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { RentalService } from '../services/rental.service';
import { WindowSizeService } from '../services/window-size.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('addFundsDialog') addFundsDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  profile: Profile = {} as Profile;
  isEditingWallet = false;
  walletBalance!: number;
  isAdmin: boolean = false;
  funds: number = 0;
  isMobile: boolean = false;
  dataSource = new MatTableDataSource<Rental>();
  filterByReturnDate: string | null = 'all';
  rentals: Rental[] = [];
  filteredRentals: Rental[] = [];
  totalResults: number = 0;
  private subscriptions: Subscription = new Subscription();
  displayedColumns: string[] = [
    'uuid',
    'rental_date',
    'return_date',
    'is_paid',
    'movie',
    'actions',
  ];

  constructor(
    private profileService: ProfileService,
    private rentalService: RentalService,
    private cdRef: ChangeDetectorRef,
    private alertService: AlertService,
    private authService: AuthService,
    private windowSizeService: WindowSizeService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.windowSizeService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      })
    );
    this.authService.isAdminUser().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
      if (isAdmin) {
        this.displayedColumns.splice(4, 0, 'user');
      } else {
        this.displayedColumns = this.displayedColumns.filter(
          (col) => col !== 'user'
        );
      }
      this.cdRef.detectChanges();
    });
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.walletBalance = profile.wallet;
      this.loadRentals(
        this.paginator?.pageIndex + 1 || 1,
        this.paginator?.pageSize || 10
      );
    });
  }

  loadRentals(page: number, pageSize: number): void {
    this.rentalService.getAllRentals(page, pageSize).subscribe({
      next: (response: RentalsResponse) => {
        this.totalResults = response.count;
        this.rentals = response.results;

        if (!this.isAdmin) {
          this.rentals = this.rentals.filter(
            (rental) => rental.user === this.profile.email
          );
        }

        this.rentals = this.applyReturnDateFilter(this.rentals);
        this.filteredRentals = [...this.rentals];
        this.dataSource.data = [...this.rentals];

        if (this.paginator) {
          this.paginator.length = this.totalResults;
        }

        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.alertService.openAlert({
          type: 'alert',
          title: 'Error',
          message: 'Error loading rentals.',
        });
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.loadRentals(event.pageIndex + 1, event.pageSize);
  }

  applyReturnDateFilter(rentals: Rental[]): Rental[] {
    if (this.filterByReturnDate === 'no-return-date') {
      return rentals.filter((rental) => !rental.return_date);
    } else if (this.filterByReturnDate === 'with-return-date') {
      return rentals.filter((rental) => rental.return_date);
    } else {
      return rentals;
    }
  }

  returnMovie(rentalUuid: string): void {
    this.rentalService.returnMovie(rentalUuid).subscribe({
      next: (response) => {
        this.alertService.openAlert({
          type: 'alert',
          title: 'Success',
          message: 'Movie returned.',
        });
        this.loadProfile();
        this.loadRentals(
          this.paginator?.pageIndex + 1 || 1,
          this.paginator?.pageSize || 10
        );
      },
      error: (error) => {
        this.alertService.openAlert({
          type: 'alert',
          title: 'Error',
          message:
            'Could not return movie. Please check if your wallet budget is enough for the fee.',
        });
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    this.filteredRentals = this.rentals.filter(
      (rental) =>
        rental.movie.toLowerCase().includes(filterValue) ||
        rental.uuid.toLowerCase().includes(filterValue)
    );

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeReturnDateFilter(filter: string): void {
    this.filterByReturnDate = filter;
    this.loadRentals(
      this.paginator?.pageIndex + 1 || 1,
      this.paginator?.pageSize || 10
    );
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
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'Error adding funds.',
          });
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
