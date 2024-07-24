import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
    onSubmit(): void {
      if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
    
        this.authService.login(username, password).subscribe(
          () => {
            const role = this.authService.getRole();
            if (role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/movies']);
            }
          },
          error => {
            this.errorMessage = 'Invalid username or password';
            console.error('Login failed', error);
          }
        );
      }
    }

}

