import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  dataSource = new MatTableDataSource<Rental>();
  totalRentals = 0;
  isMobile: boolean = false;
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
      }
      this.cdRef.detectChanges();
    });
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
    console.log('Loading user rentals');
    if (this.paginator) {
      const page = this.paginator.pageIndex + 1;
      const pageSize = this.paginator.pageSize;
  
      console.log('Fetching rentals for page:', page, 'Page size:', pageSize);
  
      this.fetchRentals(page, pageSize).pipe(
        tap((response) => {
          console.log('API Response:', response);
          this.totalRentals = response.count;
          if (!this.isAdmin) {
            const filteredRentals = response.results.filter(
              rental => rental.user === this.profile.email
            );
            this.dataSource.data = filteredRentals;
          } else {
            this.dataSource.data = response.results;
          }
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
        this.alertService.openAlert({
          type: 'alert',
          title: 'Success',
          message: 'Movie returned.'
        });
        this.loadProfile();
        this.loadUserRentals();
      },
      error: (error) => {
        this.alertService.openAlert({
          type: 'alert',
          title: 'Error',
          message: 'Could not return movie. Please check if your wallet budget is enough for the fee.'
        });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
            message: 'Error adding funds.'
          });
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
