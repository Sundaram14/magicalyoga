import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  videos: string[] = [
    'magicalyoga/assets/Videos/video1.mp4',
    'assets/Videos/video2.mp4',
    'assets/Videos/video3.mp4'
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
