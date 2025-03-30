import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-student-gallery',
  imports: [CommonModule],
  templateUrl: './student-gallery.component.html',
  styleUrl: './student-gallery.component.css',
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
export class StudentGalleryComponent {
  photos: string[] = [
    'assets/Images/student1.webp',
    'assets/Images/student2.webp',
    '/assets/Images/student3.webp',
    '/assets/Images/student4.webp',
    '/assets/Images/student5.webp',
    '/assets/Images/student6.webp',
    '/assets/Images/student7.webp',
    '/assets/Images/student8.webp',
    '/assets/Images/student9.webp',
  ];

  visiblePhotos: string[] = []; // Images currently displayed
  currentIndex = 0; // Tracks the start index of visible images
  imagesPerSlide = 3; // Number of images shown per slide

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.updateImagesPerSlide(); // Run only on the client side
    }
    this.updateVisiblePhotos(); // Always update visible photos
  }

  // Detect and set imagesPerSlide based on screen size
  updateImagesPerSlide(): void {
    if (isPlatformBrowser(this.platformId)) {
      const screenWidth = window.innerWidth;
      this.imagesPerSlide = screenWidth < 768 ? 1 : 3;
      console.log("screen: ",screenWidth," img:", this.imagesPerSlide);
    }
  }
  

  // Update visible photos based on the current index
  updateVisiblePhotos(): void {
    this.visiblePhotos = this.photos.slice(
      this.currentIndex,
      this.currentIndex + this.imagesPerSlide
    );
    

    // Wrap around if there are not enough images in the array
    if (this.visiblePhotos.length < this.imagesPerSlide) {
      this.visiblePhotos = this.visiblePhotos.concat(
        this.photos.slice(0, this.imagesPerSlide - this.visiblePhotos.length)
      );
    }
  }



  // Move to the previous set of images
  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - this.imagesPerSlide + this.photos.length) %
      this.photos.length;
    this.updateVisiblePhotos();
  }

  // Move to the next set of images
  nextSlide(): void {
    this.currentIndex =
      (this.currentIndex + this.imagesPerSlide) % this.photos.length;
    this.updateVisiblePhotos();
  }
}
