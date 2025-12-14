// services/membership.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import {Recording} from '../models/recording.model'

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
  recordings: Recording[];
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
    getRecordings(): Observable<Recording[]> {
      return this.http.get<{ recordings: any[] }>(`${this.apiUrl}/membership/GetRecordings`)
        .pipe(
          map(res => res?.recordings ?? []),
          map(list => list.map(r => ({
            id: r.id,
            programId: r.programId,
            programName: r.programName ?? r.program?.name ?? null,
            title: r.title,
            description: r.description ?? null,
            youtubeVideoId: (r.youtubeVideoId ?? r.youTubeVideoId ?? r.YouTubeVideoId ?? r.youtubeId ?? '').toString(),
            durationMinutes: r.durationMinutes ?? null,
            sequenceOrder: r.sequenceOrder ?? 0,
            isActive: r.isActive ?? true
          } as Recording)))
        );
    }

  private handleError(defaultMessage: string, error: any) {
    const message = error.error?.message || defaultMessage;
    return throwError(() => new Error(message));
  }
}