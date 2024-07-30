import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Profile } from '../interface/profile';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { WindowSizeService } from '../services/window-size.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('addFundsDialog') addFundsDialog!: TemplateRef<any>;
  profile: Profile = {} as Profile;
  isEditingWallet = false;
  walletBalance!: number;
  isAdmin: boolean = false;
  isMobile: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private profileService: ProfileService,
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
      this.cdRef.detectChanges();
    });
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.walletBalance = profile.wallet;
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
