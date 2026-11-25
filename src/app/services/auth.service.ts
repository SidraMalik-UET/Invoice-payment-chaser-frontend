
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// User data interface
export interface User {
  id: number;
  name: string;
  email: string;
}

// Login response interface
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Current user response interface
interface MeResponse {
  success: boolean;
  data: {
    user: User;
    workspaces: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/auth';

  // Store current user using Angular Signal
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.data.token);
        this.currentUser.set(response.data.user);
      })
    );
  }

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get current logged-in user
  getCurrentUser(): Observable<MeResponse> {

    return this.http.get<MeResponse>(
      `${this.apiUrl}/me`
    ).pipe(
      tap(response => {
        this.currentUser.set(response.data.user);
      })
    );
  }

  // Logout
  logout(): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/logout`,
      {}
    ).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.currentUser.set(null);
      })
    );
  }
}
