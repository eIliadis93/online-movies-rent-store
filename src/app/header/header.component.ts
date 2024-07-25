import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userName: string | null = '';
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.loginStatusChange.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      this.userName = localStorage.getItem('username');
      this.cdRef.detectChanges();
    });

    this.authService.isAdminUser().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
      this.cdRef.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
  }
}
