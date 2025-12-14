import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { 
  AdminUser, 
  AdminUserDetails, 
  PaginatedUsersResponse,
  UserProfile,
  Membership,
  Journal
} from '../models/admin-user.model';



export interface Recording {
  id: string;
  programId: string;
  programName: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  durationMinutes: number;
  sequenceOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalMemberships: number;
  activeMemberships: number;
  totalRevenue: number;
  revenueToday: number;
  programsCount: number;
  recordingsCount: number;
  recentPayments: RecentPayment[];
}

export interface RecentPayment {
  userId: string;
  email: string;
  amount: number;
  program: string;
  timeAgo: string;
}



export interface UserDetailsResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  whatsAppNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  profile: UserProfile;
  memberships: Membership[];
  recentJournals: Journal[];
  isProfileCompleted: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // USER MANAGEMENT

  getUsers(page: number = 1, pageSize: number = 20, search?: string, isAdmin?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (isAdmin !== undefined) {
      params = params.set('isAdmin', isAdmin.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/admin/users`, { params })
      .pipe(
        tap(response => console.log('Users API Response:', response)),
        catchError(error => this.handleError('Failed to load users', error))
      );
  }

  getUserDetails(userId: string): Observable<AdminUserDetails> {
    return this.http.get<AdminUserDetails>(`${this.apiUrl}/admin/users/${userId}`)
      .pipe(
        catchError(error => this.handleError('Failed to load user details', error))
      );
  }
  // DASHBOARD

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/dashboard/stats`)
      .pipe(
        catchError(error => this.handleError('Failed to load dashboard stats', error))
      );
  }

  // RECORDINGS MANAGEMENT

  getRecordings(programId?: string, search?: string): Observable<Recording[]> {
    let params = new HttpParams();

    if (programId) {
      params = params.set('programId', programId);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Recording[]>(`${this.apiUrl}/admin/recordings`, { params })
      .pipe(
        catchError(error => this.handleError('Failed to load recordings', error))
      );
  }

  createRecording(recordingData: Partial<Recording>): Observable<Recording> {
    return this.http.post<Recording>(`${this.apiUrl}/admin/recordings`, recordingData)
      .pipe(
        catchError(error => this.handleError('Failed to create recording', error))
      );
  }

  updateRecording(recordingId: string, recordingData: Partial<Recording>): Observable<Recording> {
    return this.http.put<Recording>(`${this.apiUrl}/admin/recordings/${recordingId}`, recordingData)
      .pipe(
        catchError(error => this.handleError('Failed to update recording', error))
      );
  }

  deleteRecording(recordingId: string): Observable<{ message: string, recordingId: string }> {
    return this.http.delete<{ message: string, recordingId: string }>(`${this.apiUrl}/admin/recordings/${recordingId}`)
      .pipe(
        catchError(error => this.handleError('Failed to delete recording', error))
      );
  }
  private handleError(defaultMessage: string, error: any) {
    const message = error.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}