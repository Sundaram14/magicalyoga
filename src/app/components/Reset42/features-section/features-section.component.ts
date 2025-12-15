import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../../../../models/program.models';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.css']
})
export class FeaturesSectionComponent {
  @Input() features: Feature[] = [];

  getGradient(color?: string): string {
    const baseColor = color || '#0097b2';
    const darkColor = this.darkenColor(baseColor, 20);
    return `linear-gradient(135deg, ${baseColor}, ${darkColor})`;
  }

  private darkenColor(color: string, percent: number): string {
    // Simple color darkening for gradient
    return color;
  }

  trackByFeature(index: number, feature: Feature): string {
    return feature.title;
  }

  onLearnMore(): void {
    const timeline = document.querySelector('app-timeline-section');
    if (timeline) {
      timeline.scrollIntoView({ behavior: 'smooth' });
    }
  }
}