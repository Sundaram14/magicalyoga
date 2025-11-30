// services/membership.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface Membership {
  id: string;
  programId: string;
  programName: string;
  programCategory: string;
  programImage: string;
  programDescription: string;
  whatsAppGroupLink: string; 
  status: string;
  startDate: string;
  endDate?: string;
  whatsAppJoined: boolean;
  whatsAppJoinDate?: string;
  accessRevoked: boolean;
  daysRemaining?: number;
  isActive: boolean;
}

export interface MembershipsResponse {
  memberships: Membership[];
}

export interface AccessCheckResponse {
  hasAccess: boolean;
  programName?: string;
  programCategory?: string;
}

export interface WhatsAppConfirmResponse {
  message: string;
  whatsAppJoined: boolean;
  whatsAppJoinDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMyMemberships(): Observable<MembershipsResponse> {
    return this.http.get<MembershipsResponse>(`${this.apiUrl}/membership/my-memberships`)
      .pipe(
        catchError(error => this.handleError('Failed to load memberships', error))
      );
  }

  checkAccess(programId: string): Observable<AccessCheckResponse> {
    return this.http.get<AccessCheckResponse>(`${this.apiUrl}/membership/check-access/${programId}`)
      .pipe(
        catchError(error => this.handleError('Failed to check access', error))
      );
  }

  confirmWhatsAppJoin(programId: string): Observable<WhatsAppConfirmResponse> {
    return this.http.post<WhatsAppConfirmResponse>(
      `${this.apiUrl}/membership/confirm-whatsapp/${programId}`, 
      {}
    ).pipe(
      catchError(error => this.handleError('Failed to confirm WhatsApp join', error))
    );
  }

  private handleError(defaultMessage: string, error: any) {
    const message = error.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}