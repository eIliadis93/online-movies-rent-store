import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Rental, RentalsResponse } from '../interface/rental';
import { AlertService } from '../services/alert.service';
import { RentalService } from '../services/rental.service';

@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.scss'],
})
export class RentalsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() profileEmail: string = '';
  @Input() isAdmin: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() isMobile: boolean = false;

  dataSource = new MatTableDataSource<Rental>();
  rentals: Rental[] = [];
  filteredRentals: Rental[] = [];
  totalResults: number = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  filterByReturnDate: string | null = 'all';
  isActiveFilter: boolean = false; // Added for active filter
  displayedColumns: string[] = [
    'uuid',
    'rental_date',
    'return_date',
    'is_paid',
    'movie',
    'actions',
  ];

  constructor(
    private rentalService: RentalService,
    private cdRef: ChangeDetectorRef,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.fetchRentals();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  updateDisplayedColumns() {
    if (this.isAdmin) {
      if (!this.displayedColumns.includes('user')) {
        this.displayedColumns.splice(5, 0, 'user');
      }
    } else {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== 'user'
      );
    }
  }

  fetchRentals(): void {
    console.log(
      'Fetching rentals for page index:',
      this.pageIndex,
      'page size:',
      this.pageSize
    ); // Debug log

    this.rentalService
      .getRentals(
        this.pageIndex + 1,
        this.pageSize,
        this.isActiveFilter // Assuming this parameter is supported by the API
      )
      .subscribe({
        next: (response: RentalsResponse) => {
          console.log('Fetched rentals response:', response); // Debug log

          this.totalResults = response.count; // Total count from API
          this.rentals = response.results; // Rental data
          this.applyFilters(); // Apply any filters
          this.dataSource.data = this.filteredRentals; // Update data source

          // Ensure paginator reflects the current page, size, and length
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
            this.paginator.length = this.totalResults;
          }

          this.cdRef.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Error loading rentals:', error); // Debug log
          this.alertService.openAlert({
            type: 'alert',
            title: 'Error',
            message: 'Error loading rentals.',
          });
        },
      });
  }

  onPageChange(event: PageEvent): void {
    console.log(
      'Page changed to index:',
      event.pageIndex,
      'page size:',
      event.pageSize
    ); // Debug log
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchRentals(); // Refetch rentals when page changes
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

  applyFilters(): void {
    this.filteredRentals = this.rentals.filter(
      (rental) => this.isAdmin || rental.user === this.profileEmail
    );
    this.filteredRentals = this.applyReturnDateFilter(this.filteredRentals);
  }

  returnMovie(rentalUuid: string): void {
    this.rentalService.returnMovie(rentalUuid).subscribe({
      next: (response) => {
        this.alertService.openAlert({
          type: 'alert',
          title: 'Success',
          message: 'Movie returned.',
        });
        this.fetchRentals(); // Refetch rentals to reflect the return
      },
      error: (error) => {
        console.error('Error returning movie:', error); // Debug log
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

    this.dataSource.data = this.filteredRentals;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to first page after filtering
    }
  }

  toggleActiveFilter(): void {
    this.isActiveFilter = !this.isActiveFilter;
    this.fetchRentals(); // Refetch rentals when filter changes
  }

  changeReturnDateFilter(filter: string): void {
    this.filterByReturnDate = filter;
    this.applyFilters();
    this.dataSource.data = this.filteredRentals;
    this.paginator.firstPage();
  }

  ngOnDestroy(): void {}
}
