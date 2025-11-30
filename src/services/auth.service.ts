import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = environment.apiUrl;
  private tokenKey = 'magical_yoga_token';
  private userKey = 'magical_yoga_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => this.handleError('Login failed', error))
      );
  }

  register(registerRequest: RegisterRequest): Observable<LoginResponse> {
    console.log('Calling register endpoint:', `${this.apiUrl}/auth/register`); // Debug log
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, registerRequest)
      .pipe(
        tap(response => {
          console.log('Register successful:', response);
          this.handleAuthentication(response);
        }),
        catchError(error => {
          console.error('Register API error:', error);
          return this.handleError('Registration failed', error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check token expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  refreshUserData(): void {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  private handleAuthentication(response: LoginResponse): void {
    if (response.success && response.token) {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  private handleError(defaultMessage: string, error: any) {
    const message = error.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}