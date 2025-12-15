// payment.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export interface CreateOrderRequest {
  programId: string;
  programName: string;
  amount: number;
  currency: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    razorpayKey: string;
    amount: number;
    currency: string;
    programName: string;
  };
  message?: string; // Add this
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    message: string;
    paymentId: string;
    orderId: string;
    amount: number;
    programId: string;
    whatsAppGroupLink: string;
  };
  message?: string; // Add this
}

export interface VerifyPaymentRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  programId: string;
}


export interface MembershipCheckResponse {
  success: boolean;
  hasMembership: boolean;
}

export interface WhatsAppConfirmResponse {
  message: string;
  whatsAppJoined: boolean;
  whatsAppJoinDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createOrder(programId: string, programName: string, amount: number): Observable<CreateOrderResponse> {
    const request: CreateOrderRequest = {
      programId,
      programName,
      amount,
      currency: 'INR'
    };

    console.log('Creating order with:', request);
    console.log('API URL:', `${this.apiUrl}/payment/create-order`);

    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/payment/create-order`, request)
      .pipe(
        catchError(error => {
          console.error('Payment order creation error:', error);
          return throwError(() => new Error(
            error.error?.message || 'Failed to create payment order. Please try again.'
          ));
        })
      );
  }

  verifyPayment(verifyRequest: VerifyPaymentRequest): Observable<VerifyPaymentResponse> {
    return this.http.post<VerifyPaymentResponse>(`${this.apiUrl}/payment/verify-payment`, verifyRequest)
      .pipe(
        catchError(error => {
          console.error('Payment verification error:', error);
          return throwError(() => new Error(
            error.error?.message || 'Payment verification failed. Please contact support.'
          ));
        })
      );
  }

  checkMembership(programId: string): Observable<MembershipCheckResponse> {
    return this.http.get<MembershipCheckResponse>(`${this.apiUrl}/membership/check-membership/${programId}`)
      .pipe(
        catchError(error => {
          console.error('Membership check error:', error);
          return throwError(() => new Error(
            error.error?.message || 'Failed to check membership status.'
          ));
        })
      );
  }

  confirmWhatsAppJoin(programId: string): Observable<WhatsAppConfirmResponse> {
    return this.http.post<WhatsAppConfirmResponse>(
      `${this.apiUrl}/membership/confirm-whatsapp/${programId}`, 
      {}
    ).pipe(
      catchError(error => {
        console.error('WhatsApp confirmation error:', error);
        return throwError(() => new Error(
          error.error?.message || 'Failed to confirm WhatsApp join.'
        ));
      })
    );
  }

  checkAccess(programId: string): Observable<{hasAccess: boolean; programName?: string; programCategory?: string}> {
    return this.http.get<{hasAccess: boolean; programName?: string; programCategory?: string}>(
      `${this.apiUrl}/membership/check-access/${programId}`
    ).pipe(
      catchError(error => {
        console.error('Access check error:', error);
        return throwError(() => new Error(
          error.error?.message || 'Failed to check access status.'
        ));
      })
    );
  }
}