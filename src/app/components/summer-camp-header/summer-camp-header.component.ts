import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summer-camp-header',
  imports: [CommonModule],
  templateUrl: './summer-camp-header.component.html',
  styleUrl: './summer-camp-header.component.css'
})
export class SummerCampHeaderComponent {
  videos: string[] = [
    'assets/Videos/sc0.mp4',
    'assets/Videos/sc1.mp4'
  ];


  currentVideoIndex: number = 0;
  transitioning: boolean = false;

  changeVideo(index: number): void {
    if (this.currentVideoIndex !== index) {
      this.transitioning = true;
      setTimeout(() => {
        this.currentVideoIndex = index;
        this.transitioning = false;
      }, 500); // Smooth transition time
    }
  }
}
