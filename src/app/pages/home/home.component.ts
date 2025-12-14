import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component'; 
interface HeroSlide {
  id: number;
  title: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  badge: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface GalleryImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink , FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  private resizeListener?: () => void;
  private heroSliderInterval?: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Hero Slider Data
  heroSlides: HeroSlide[] = [
    {
      id: 1,
      title: 'Reset42 – Premium Program',
      description: '42-day transformative journey to reset your health and wellness. Experience complete body-mind transformation with personalized guidance.',
      cta: 'Start Your Journey',
      link: '/reset42',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      badge: 'Premium'
    },
    {
      id: 2,
      title: 'Live Online Classes',
      description: 'Join our interactive live yoga sessions from anywhere. Experience real-time guidance with expert instructors and a supportive community.',
      cta: 'Contact Us',
      link: '/contact',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
      badge: 'Live'
    },
    {
      id: 3,
      title: 'Magical Mama',
      description: 'Specialized prenatal and postnatal yoga programs designed for expecting and new mothers. Safe, nurturing practices for your journey.',
      cta: 'Contact Us',
      link: '/contact',
      image: 'assets/Images/hero/hero-3.png',
      badge: 'For Mothers'
    }
  ];


  currentSlide = 0;

  // Benefits data
  benefits: Benefit[] = [
    {
      icon: 'fas fa-spa',
      title: 'Holistic Wellness',
      description: 'Complete mind-body transformation through traditional yoga practices'
    },
    {
      icon: 'fas fa-users',
      title: 'Expert Guidance',
      description: 'Learn from certified instructors with years of experience'
    },
    {
      icon: 'fas fa-star',
      title: 'Flexible Timing',
      description: 'Choose from morning, evening, or weekend batches'
    },
    {
      icon: 'fas fa-heart',
      title: 'Personalized Care',
      description: 'Individual attention and customized programs for your goals'
    }
  ];

  // Gallery images
  galleryImages: GalleryImage[] = [
    { url: 'assets/Images/gallery/student1.webp', alt: 'Yoga Class Moment 1' },
    { url: 'assets/Images/gallery/student2.webp', alt: 'Yoga Class Moment 2' },
    { url: 'assets/Images/gallery/student3.webp', alt: 'Yoga Class Moment 3' },
    { url: 'assets/Images/gallery/student4.webp', alt: 'Yoga Class Moment 4' },
    { url: 'assets/Images/gallery/student5.webp', alt: 'Yoga Class Moment 5' },
    { url: 'assets/Images/gallery/student6.webp', alt: 'Yoga Class Moment 6' },
  ];

  currentGalleryIndex = 0;
  imagesPerView = 3;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateImagesPerView();
      this.setupResizeListener();
      this.startHeroSlider();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }
      if (this.heroSliderInterval) {
        clearInterval(this.heroSliderInterval);
      }
    }
  }

  private startHeroSlider(): void {
    this.heroSliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Auto-advance every 5 seconds
  }

  private setupResizeListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeListener = () => {
        const oldImagesPerView = this.imagesPerView;
        this.updateImagesPerView();
        
        if (oldImagesPerView !== this.imagesPerView) {
          const maxIndex = this.galleryImages.length - this.imagesPerView;
          this.currentGalleryIndex = Math.min(this.currentGalleryIndex, maxIndex);
        }
      };
      window.addEventListener('resize', this.resizeListener);
    }
  }

  private updateImagesPerView(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      if (width >= 992) {
        this.imagesPerView = 3;
      } else if (width >= 768) {
        this.imagesPerView = 2;
      } else {
        this.imagesPerView = 1;
      }
    }
  }

  // Hero Slider Methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Gallery Methods
  previousGalleryImage(): void {
    if (this.currentGalleryIndex > 0) {
      this.currentGalleryIndex--;
    }
  }

  nextGalleryImage(): void {
    const maxIndex = this.galleryImages.length - this.imagesPerView;
    if (this.currentGalleryIndex < maxIndex) {
      this.currentGalleryIndex++;
    }
  }

  getVisibleGalleryImages(): GalleryImage[] {
    return this.galleryImages.slice(
      this.currentGalleryIndex,
      this.currentGalleryIndex + this.imagesPerView
    );
  }

  canGoPrevious(): boolean {
    return this.currentGalleryIndex > 0;
  }

  canGoNext(): boolean {
    return this.currentGalleryIndex < this.galleryImages.length - this.imagesPerView;
  }

  goToImage(index: number): void {
    const maxIndex = this.galleryImages.length - this.imagesPerView;
    this.currentGalleryIndex = Math.min(index, maxIndex);
  }
}