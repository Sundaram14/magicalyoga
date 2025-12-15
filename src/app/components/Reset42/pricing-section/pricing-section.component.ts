import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Program } from '../../../../models/program.models';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.css']
})
export class PricingSectionComponent {
  @Input() program!: Program;
  @Input() isEnrolling = false;
  @Output() enrollClick = new EventEmitter<void>();

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}