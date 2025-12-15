import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offering } from '../../../../models/program.models';

@Component({
  selector: 'app-offerings-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offerings-section.component.html',
  styleUrls: ['./offerings-section.component.css']
})
export class OfferingsSectionComponent {
  @Input() offerings: Offering[] = [];
  @Input() isEnrolling = false;
  @Output() enrollClick = new EventEmitter<void>();

  trackByOffering(index: number, offering: Offering): string {
    return offering.title;
  }
}