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

interface Announcement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  ageCategory?: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badgeColor: string; // 'primary', 'success', 'warning', 'info'
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
  private announcementInterval?: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Announcements data - CAROUSEL CONTENT
  announcements: Announcement[] = [
    {
      id: '1',
      badge: "What's New?",
      badgeColor: 'primary',
      title: 'Stretch Into Summer: Enroll in Summer Yoga Camp',
      subtitle: 'Limited Seats Available!',
      description: 'Breathe, stretch, and unwind with us. Experience yoga, mindfulness, and fun activities designed to refresh your mind and body this summer.',
      ageCategory: '8 to 18 years old',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      ctaText: 'View Camp Details',
      ctaLink: '/summer-camp'
    },
    {
      id: '2',
      badge: 'New Program',
      badgeColor: 'success',
      title: 'Reset42: Transform Your Life in 42 Days',
      subtitle: 'Holistic Wellness Journey',
      description: 'Join our transformative 42-day program combining yoga, meditation, and lifestyle changes for complete mind-body wellness.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      ctaText: 'Start Your Journey',
      ctaLink: '/reset42'
    },
    {
      id: '3',
      badge: 'Special Offer',
      badgeColor: 'info',
      title: 'Prenatal Yoga Classes - Now Enrolling',
      subtitle: 'Safe & Nurturing Practice',
      description: 'Specially designed classes for expecting mothers. Join our supportive community and prepare your body and mind for motherhood.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      ctaText: 'Join Prenatal Classes',
      ctaLink: '/classes/prenatal'
    },
    {
      id: '4',
      badge: 'Limited Time',
      badgeColor: 'warning',
      title: 'Early Bird Registration - Save 20%',
      subtitle: 'Register Now & Save',
      description: 'Get exclusive early bird pricing on all our yoga programs. Limited spots available at discounted rates.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      ctaText: 'Register Now',
      ctaLink: '/register'
    }
  ];

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
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      features: ['Playful Learning', 'Body Awareness', 'Confidence', 'Focus'],
      route: '/classes/kids'
    },
    {
      id: '3',
      title: 'Prenatal Yoga',
      description: 'Safe and nurturing yoga practice for expecting mothers',
      category: 'Prenatal',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
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

  // Benefits data
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

  // Instructors data
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
  
  // Announcement carousel state
  currentAnnouncementIndex = 0;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateImagesPerView();
      this.setupResizeListener();
      this.initializeLazyLoading();
      this.startAnnouncementAutoPlay();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }
      if (this.announcementInterval) {
        clearInterval(this.announcementInterval);
      }
    }
  }

  // Announcement carousel methods
  private startAnnouncementAutoPlay(): void {
    this.announcementInterval = setInterval(() => {
      this.nextAnnouncement();
    }, 5000); // Change every 5 seconds
  }

  previousAnnouncement(): void {
    this.currentAnnouncementIndex = 
      this.currentAnnouncementIndex === 0 
        ? this.announcements.length - 1 
        : this.currentAnnouncementIndex - 1;
    this.resetAnnouncementAutoPlay();
  }

  nextAnnouncement(): void {
    this.currentAnnouncementIndex = 
      this.currentAnnouncementIndex === this.announcements.length - 1 
        ? 0 
        : this.currentAnnouncementIndex + 1;
  }

  goToAnnouncement(index: number): void {
    this.currentAnnouncementIndex = index;
    this.resetAnnouncementAutoPlay();
  }

  getCurrentAnnouncement(): Announcement {
    return this.announcements[this.currentAnnouncementIndex];
  }

  private resetAnnouncementAutoPlay(): void {
    if (this.announcementInterval) {
      clearInterval(this.announcementInterval);
      this.startAnnouncementAutoPlay();
    }
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

// Add this method to your HomeComponent class
  getBenefitIcon(emojiIcon: string): string {
    const iconMap: { [key: string]: string } = {
      '🧘‍♀️': 'fas fa-spa', // Yoga pose → Spa icon
      '🌟': 'fas fa-star', // Star
      '✨': 'fas fa-magic', // Sparkles → Magic wand
      '🎯': 'fas fa-bullseye', // Target
      '📱': 'fas fa-mobile-alt', // Mobile
      '👥': 'fas fa-users', // Users
      '👶': 'fas fa-child', // Child
      '⏱️': 'fas fa-stopwatch', // Stopwatch
      '💪': 'fas fa-dumbbell', // Strength → Dumbbell
      '🌿': 'fas fa-leaf', // Leaf/nature
      '🎓': 'fas fa-graduation-cap', // Education
      '❤️': 'fas fa-heart', // Heart
      '🏆': 'fas fa-trophy', // Trophy
      '🔒': 'fas fa-lock', // Security
      '🚀': 'fas fa-rocket' // Rocket
    };
    
    return iconMap[emojiIcon] || 'fas fa-circle'; // Default icon
  }
}