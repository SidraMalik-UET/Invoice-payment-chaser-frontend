
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    console.log('Login button clicked!');
    console.log('Email:', this.email);

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        console.log('Login successful:', response);

        alert('Login successful!');

        // Redirect to dashboard after successful login
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
