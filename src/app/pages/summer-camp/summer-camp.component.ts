import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummerCampHeaderComponent } from '../../components/summer-camp-header/summer-camp-header.component';
import { SummerCampOverviewComponent } from '../../components/summer-camp-overview/summer-camp-overview.component';
import { SummerCampSylComponent } from '../../components/summer-camp-syl/summer-camp-syl.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { AboutFounderComponent } from '../../components/about-founder/about-founder.component';

@Component({
  selector: 'app-summer-camp',
  standalone: true,
  imports: [CommonModule,SummerCampHeaderComponent,SummerCampOverviewComponent, SummerCampSylComponent, CtaSectionComponent, AboutFounderComponent],
  templateUrl: './summer-camp.component.html',
  styleUrls: ['./summer-camp.component.css']
})
export class SummerCampComponent {
  schedule = [
    { day: 'Day 1', activity: 'Introduction and Ice Breaker' },
    { day: 'Day 2', activity: 'Foundation of Yoga' },
    { day: 'Day 3', activity: 'Understanding Body Movements' },
    { day: 'Day 4', activity: 'Mobility' },
    { day: 'Day 5', activity: 'Fun with Yoga' },
    { day: 'Day 6', activity: 'Exploring Flexibility' },
    { day: 'Day 7', activity: 'Building Core Strength' },
    { day: 'Day 8', activity: 'Breathing Awareness' },
    { day: 'Day 9', activity: 'Developing Focus + Visualization' },
    { day: 'Day 10', activity: 'Twisting in Yoga' },
    { day: 'Day 11', activity: 'Intermediate Back-Bending' },
    { day: 'Day 12', activity: 'HIIT Workout + Challenges' },
    { day: 'Day 13', activity: 'Intermediate Balancing in Yoga' },
    { day: 'Day 14', activity: 'Intermediate Twisting' },
    { day: 'Day 15', activity: 'Revision + Manifestation' },
    { day: 'Day 16', activity: 'Exploring Advanced Asanas' },
    { day: 'Day 17', activity: 'Yoga Flow' },
    { day: 'Day 18', activity: 'Individual Training' },
    { day: 'Day 19', activity: 'Individual Performance' },
    { day: 'Day 20', activity: 'A Magical Farewell' },
  ];
}
