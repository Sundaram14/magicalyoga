import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { PaymentSessionService } from '../../../services/payment-session.service';
import { PaymentStatusComponent, PaymentStatusData } from '../../components/payment-status/payment-status.component'; // Add this
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';

// Razorpay Type Declaration
declare var Razorpay: {
  new (options: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: {
      [key: string]: string;
    };
    theme?: {
      color?: string;
    };
    modal?: {
      ondismiss?: () => void;
    };
  }): {
    open(): void;
  };
};

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, PaymentStatusComponent], // Add PaymentStatusComponent
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  programId: string = '';
  programName: string = '';
  amount: number = 0;
  isLoading: boolean = false;
  currentUser: User | null = null;
  paymentStatus: PaymentStatusData | null = null; // Add this
  
  private userSubscription: Subscription = new Subscription();
  private sessionId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private authService: AuthService,
    private paymentSessionService: PaymentSessionService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );

    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session'] || '';
      
      if (!this.sessionId) {
        this.handleInvalidSession('No payment session found');
        return;
      }

      const session = this.paymentSessionService.getPaymentSession();
      
      if (!session || session.sessionId !== this.sessionId) {
        this.handleInvalidSession('Invalid or expired payment session');
        return;
      }

      this.programId = session.programId;
      this.programName = session.programName;
      this.amount = session.amount;
    });
  }

  private handleInvalidSession(message: string) {
    console.error('Payment session error:', message);
    this.showPaymentStatus({
      success: false,
      title: 'Session Expired',
      message: 'Your payment session has expired. Please select a program again.'
    });
  }

  initiatePayment() {
    if (!this.sessionId) {
      this.handleInvalidSession('No valid session');
      return;
    }

    this.isLoading = true;

    this.paymentService.createOrder(this.programId, this.programName, this.amount)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.openRazorpayCheckout(response.data);
          } else {
            this.isLoading = false;
            this.showPaymentStatus({
              success: false,
              title: 'Order Failed',
              message: response.message || 'Failed to create payment order.'
            });
          }
        },
        error: (error) => {
          console.error('Payment error:', error);
          this.isLoading = false;
          this.showPaymentStatus({
            success: false,
            title: 'Payment Error',
            message: error.message || 'Failed to create payment order. Please try again.'
          });
        }
      });
  }

  openRazorpayCheckout(orderData: any) {
    const userName = this.currentUser ? 
      `${this.currentUser.firstName} ${this.currentUser.lastName}` : '';
    const userEmail = this.currentUser?.email || '';
    const userContact = this.currentUser?.whatsAppNumber || '';

    const options = {
      key: orderData.razorpayKey,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: 'Magical Yoga',
      description: orderData.programName,
      order_id: orderData.orderId,
      handler: (response: any) => {
        this.verifyPayment(response, orderData.orderId);
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userContact
      },
      notes: {
        programId: this.programId,
        programName: this.programName
      },
      theme: {
        color: '#0097b2'
      },
      modal: {
        ondismiss: () => {
          this.isLoading = false;
          this.showPaymentStatus({
            success: false,
            title: 'Payment Cancelled',
            message: 'You cancelled the payment process. You can try again anytime.'
          });
        }
      }
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    
    this.isLoading = false;
  }

  // In payment.component.ts - Update the verifyPayment method
verifyPayment(paymentResponse: any, orderId: string) {
  this.isLoading = true;

  const verifyRequest = {
    razorpayPaymentId: paymentResponse.razorpay_payment_id,
    razorpayOrderId: paymentResponse.razorpay_order_id,
    razorpaySignature: paymentResponse.razorpay_signature,
    programId: this.programId
  };

  this.paymentService.verifyPayment(verifyRequest)
    .subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // ✅ CHANGED: Redirect directly to dashboard after successful payment
          this.router.navigate(['/dashboard']);
          
          // Clear the payment session after successful payment
          this.paymentSessionService.clearPaymentSession();
          
          // Optional: Show success toast/message on dashboard
          // You can use a service to pass success message to dashboard
        } else {
          this.showPaymentStatus({
            success: false,
            title: 'Payment Failed',
            message: response.message || 'Payment verification failed.'
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Payment verification failed:', error);
        this.showPaymentStatus({
          success: false,
          title: 'Verification Failed',
          message: error.message || 'Payment verification failed. Please contact support with your payment ID.'
        });
      }
    });
}

  // New method to show payment status
  private showPaymentStatus(statusData: PaymentStatusData) {
    this.paymentStatus = statusData;
  }

  // Method to reset and try again
  resetPayment() {
    this.paymentStatus = null;
    this.initiatePayment();
  }

  cancelPayment() {
    this.router.navigate(['/classes']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  
}