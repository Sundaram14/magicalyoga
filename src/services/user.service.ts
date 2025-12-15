import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ProfileResponse, UpdateProfileRequest } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/profile/my-profile`)
      .pipe(
        catchError(error => this.handleError('Failed to load profile', error))
      );
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update-profile`, profileData)
      .pipe(
        catchError(error => this.handleError('Failed to update profile', error))
      );
  }

  completeProfile(profileData: UpdateProfileRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/complete-profile`, profileData)
      .pipe(
        catchError(error => this.handleError('Failed to complete profile', error))
      );
  }

  private handleError(defaultMessage: string, error: any) {
    const message = error.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}