import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userName = localStorage.getItem('username');
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.loginStatusChange.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      this.cdRef.detectChanges(); // Manually trigger change detection
    });
  }

  logout() {
    this.authService.logout();
  }
}
