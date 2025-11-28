import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { JournalEntry, CreateJournalRequest, UpdateJournalRequest } from '../models/journal.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private http = inject(HttpClient);
  
  // FIX: Remove the extra /api since environment.apiUrl already includes it
  private apiUrl = `${environment.apiUrl}/journal`;

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 400) {
        errorMessage = 'Invalid request data';
      } else if (error.status === 401) {
        errorMessage = 'Please log in again';
      } else if (error.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.status === 404) {
        errorMessage = 'Journal entry not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error, please try again later';
      }
    }
    
    console.error('Journal API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  getUserEntries(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getRecentEntries(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(`${this.apiUrl}/recent`).pipe(
      catchError(this.handleError)
    );
  }

  getEntry(id: string): Observable<JournalEntry> {
    return this.http.get<JournalEntry>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createEntry(entry: CreateJournalRequest): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(this.apiUrl, entry).pipe(
      catchError(this.handleError)
    );
  }

  updateEntry(id: string, entry: UpdateJournalRequest): Observable<JournalEntry> {
    return this.http.put<JournalEntry>(`${this.apiUrl}/${id}`, entry).pipe(
      catchError(this.handleError)
    );
  }

  deleteEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}