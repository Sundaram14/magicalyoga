import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

export interface PaymentStatusData {
  success: boolean;
  title: string;
  message: string;
}

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent {
  @Input() statusData!: PaymentStatusData;
  @Output() retryPayment = new EventEmitter<void>();

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToClasses() {
    this.router.navigate(['/classes']);
  }

  onRetry() {
    this.retryPayment.emit();
  }
}