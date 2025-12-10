import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../../../models/program.models';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css']
})
export class TestimonialsSectionComponent {
  @Input() testimonials: Testimonial[] = [];

  trackByTestimonial(index: number, testimonial: Testimonial): string {
    return testimonial.author;
  }
}