import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  features: string[];
  route: string;
}

interface Benefit {
  icon: string;
  title: string;
  items: string[];
}

interface Instructor {
  name: string;
  title: string;
  bio: string;
  image: string;
  specialization: string[];
}

interface GalleryImage {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  private resizeListener?: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Programs data
  programs: Program[] = [
    {
      id: '1',
      title: 'Adults Yoga',
      description: 'Transform your body and mind with our comprehensive adult yoga programs',
      category: 'Adults',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      features: ['Flexibility', 'Stress Relief', 'Strength Building', 'Mindfulness'],
      route: '/classes/adults'
    },
    {
      id: '2',
      title: 'Kids Yoga',
      description: 'Fun and engaging yoga sessions designed specifically for children',
      category: 'Kids',
      image: 'https://images.unsplash.com/photo-1599447332326-ec683f97cb40?w=800&q=80',
      features: ['Playful Learning', 'Body Awareness', 'Confidence', 'Focus'],
      route: '/classes/kids'
    },
    {
      id: '3',
      title: 'Prenatal Yoga',
      description: 'Safe and nurturing yoga practice for expecting mothers',
      category: 'Prenatal',
      image: 'https://images.unsplash.com/photo-1597075933223-86b4f85e6f92?w=800&q=80',
      features: ['Safe Practices', 'Pelvic Floor', 'Breathing', 'Bonding'],
      route: '/classes/prenatal'
    },
    {
      id: '4',
      title: 'Reset42 Program',
      description: '42-day transformative journey to reset your health and wellness',
      category: 'Special',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      features: ['42 Days', 'Full Transformation', 'Holistic Approach', 'Personal Guidance'],
      route: '/reset42'
    }
  ];

  // Benefits data - Your actual content
  benefits: Benefit[] = [
    {
      icon: '🧘‍♀️',
      title: 'Complete Yoga Experience',
      items: [
        'Asanas for physical well-being',
        'Pranayamas for breath control',
        'Meditation for inner peace',
        'Traditional yoga techniques adapted in a modern way'
      ]
    },
    {
      icon: '🌟',
      title: 'A New Practice Every Day',
      items: [
        'Strength & Stamina',
        'Flexibility & Mobility',
        'Mindfulness & Calm',
        'Face Yoga, Towel Yoga, and much more'
      ]
    },
    {
      icon: '✨',
      title: 'Your Transformation Awaits',
      items: [
        'Calm Mind for clarity and peace',
        'Strong Body to feel energized',
        'Confidence that radiates in your life',
        'Build long-lasting healthy habits'
      ]
    }
  ];

  // Instructors data - Your 3 instructors
  instructors: Instructor[] = [
    {
      name: 'Instructor Name 1',
      title: 'Senior Yoga Instructor',
      bio: 'Certified yoga instructor with over 10 years of experience in traditional and modern yoga practices.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      specialization: ['Hatha Yoga', 'Pranayama', 'Meditation']
    },
    {
      name: 'Instructor Name 2',
      title: 'Kids Yoga Specialist',
      bio: 'Passionate about bringing the joy of yoga to children. Specialized in fun and engaging yoga sessions for kids.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      specialization: ['Kids Yoga', 'Playful Learning', 'Mindfulness for Children']
    },
    {
      name: 'Instructor Name 3',
      title: 'Prenatal Yoga Expert',
      bio: 'Dedicated to supporting expecting mothers through safe and nurturing prenatal yoga practices.',
      image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80',
      specialization: ['Prenatal Yoga', 'Postnatal Care', 'Breathing Techniques']
    }
  ];

  // Gallery images - YOUR 959x1280 PORTRAIT IMAGES
  galleryImages: GalleryImage[] = [
    { url: 'assets/Images/gallery/student1.webp', alt: 'Yoga Class Moment 1' },
    { url: 'assets/Images/gallery/student2.webp', alt: 'Yoga Class Moment 2' },
    { url: 'assets/Images/gallery/student3.webp', alt: 'Yoga Class Moment 3' },
    { url: 'assets/Images/gallery/student4.webp', alt: 'Yoga Class Moment 4' },
    { url: 'assets/Images/gallery/student5.webp', alt: 'Yoga Class Moment 5' },
    { url: 'assets/Images/gallery/student6.webp', alt: 'Yoga Class Moment 6' },
  ];

  currentGalleryIndex = 0;
  imagesPerView = 3; // Desktop default

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateImagesPerView();
      this.setupResizeListener();
      this.initializeLazyLoading();
    }
  }

  ngOnDestroy(): void {
    // Clean up resize listener
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private setupResizeListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeListener = () => {
        const oldImagesPerView = this.imagesPerView;
        this.updateImagesPerView();
        
        // Adjust current index if images per view changed
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
        this.imagesPerView = 3; // Desktop: 3 images
      } else if (width >= 768) {
        this.imagesPerView = 2; // Tablet: 2 images
      } else {
        this.imagesPerView = 1; // Mobile: 1 image
      }
    }
  }

  private initializeLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset['src']) {
              img.src = img.dataset['src'];
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observer will be applied to images after view init
      setTimeout(() => {
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }, 100);
    }
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Gallery navigation methods
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