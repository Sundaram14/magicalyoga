import { Injectable } from '@angular/core';

export interface SecurePaymentSession {
  programId: string;
  programName: string;
  amount: number;
  timestamp: number;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentSessionService {
  private readonly SESSION_KEY = 'magical_yoga_payment_session';
  private readonly SESSION_EXPIRY = 30 * 60 * 1000; // 30 minutes

  createPaymentSession(programId: string, programName: string, amount: number): string {
    const sessionId = this.generateSessionId();
    
    const session: SecurePaymentSession = {
      programId,
      programName,
      amount,
      timestamp: Date.now(),
      sessionId
    };

    // Store in sessionStorage (cleared when browser closes)
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    
    return sessionId;
  }

  getPaymentSession(): SecurePaymentSession | null {
    const sessionData = sessionStorage.getItem(this.SESSION_KEY);
    
    if (!sessionData) {
      return null;
    }

    try {
      const session: SecurePaymentSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() - session.timestamp > this.SESSION_EXPIRY) {
        this.clearPaymentSession();
        return null;
      }

      return session;
    } catch {
      this.clearPaymentSession();
      return null;
    }
  }

  validateSession(sessionId: string): boolean {
    const session = this.getPaymentSession();
    return session !== null && session.sessionId === sessionId;
  }

  clearPaymentSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  private generateSessionId(): string {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}