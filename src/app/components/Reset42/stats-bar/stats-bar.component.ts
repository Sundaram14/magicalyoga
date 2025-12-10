import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stat } from '../../../../models/program.models';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.css']
})
export class StatsBarComponent {
  @Input() stats: Stat[] = [];

  getIcon(label: string): string {
    const icons: { [key: string]: string } = {
      'Students Transformed': 'fa-users',
      'Average Rating': 'fa-star',
      'Stress Reduction': 'fa-heart',
      'Days to Transform': 'fa-calendar-check'
    };
    return icons[label] || 'fa-chart-line';
  }

  trackByStat(index: number, stat: Stat): string {
    return stat.label;
  }
}