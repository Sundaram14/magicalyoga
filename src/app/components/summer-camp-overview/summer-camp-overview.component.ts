import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-summer-camp-overview',
  imports: [],
  templateUrl: './summer-camp-overview.component.html',
  styleUrl: './summer-camp-overview.component.css',
  animations: [
    trigger('fadeInTitle', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInSubtitle', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInText', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SummerCampOverviewComponent {

}
