import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PaymentSessionService } from '../../../services/payment-session.service';
import { Meta, Title } from '@angular/platform-browser';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Offering {
  icon: string;
  title: string;
  description: string;
  highlight: boolean;
}

interface Testimonial {
  text: string;
  author: string;
  result: string;
}

interface Program {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  startDate: string;
}

@Component({
  selector: 'app-reset42-landing',
  templateUrl: './reset42-landing.component.html',
  styleUrls: ['./reset42-landing.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class Reset42LandingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Program Details
  program: Program = {
    id: 'reset-42',
    title: 'Reset 42',
    price: 6499,
    originalPrice: 14000,
    startDate: '2025-01-15T00:00:00'
  };

  // Countdown
  timeLeft: CountdownTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  // Features - Updated icon names for FontAwesome
  features: Feature[] = [
    {
      icon: 'heart',
      title: 'Sleep Cycle Reset',
      description: 'Naturally restore your circadian rhythm'
    },
    {
      icon: 'brain',
      title: 'Stress Reduction',
      description: 'Reduce stress by up to 80%'
    },
    {
      icon: 'target',
      title: 'Diet Clarity',
      description: 'Build sustainable food habits'
    },
    {
      icon: 'zap',
      title: 'Mobility & Posture',
      description: 'Transform your physical alignment'
    },
    {
      icon: 'award',
      title: 'Mind Control',
      description: 'Develop daily discipline'
    }
  ];

  // Offerings - Updated icon names for FontAwesome
  offerings: Offering[] = [
    {
      icon: 'calendar',
      title: '30 Live Yoga Sessions',
      description: 'Mon–Fri, 7:30–8:30 AM IST. No recordings—show up for real change.',
      highlight: true
    },
    {
      icon: 'users',
      title: '6 Coaching Classes',
      description: 'Expert lifestyle coaching with recordings provided',
      highlight: false
    },
    {
      icon: 'message-circle',
      title: 'Fortnightly 1:1 Calls',
      description: 'Personalized guidance—30 min every two weeks',
      highlight: false
    },
    {
      icon: 'trending-up',
      title: 'Accountability Community',
      description: 'Private WhatsApp group with daily habit tracking',
      highlight: false
    },
    {
      icon: 'gamepad',
      title: 'Gamified Leaderboard',
      description: 'Weekly challenges to maintain consistency',
      highlight: false
    }
  ];

  // Testimonials
  testimonials: Testimonial[] = [
    {
      text: 'My PCOS improved, my mood is stable, and my energy levels are way better than last year. Your classes became the only thing I look forward to daily.',
      author: 'Priya M.',
      result: 'PCOS Improved'
    },
    {
      text: 'I came with 10+ years of lower back pain. After just 1 month, the pain has almost vanished! I can sit comfortably on the floor now.',
      author: 'Rajesh K.',
      result: 'Pain Free'
    },
    {
      text: 'My thyroid level came into control and I lost 1kg weight. Getting you as our tutor is a god-sent gift.',
      author: 'Deepa S.',
      result: 'Thyroid Controlled'
    },
    {
      text: 'I lost 6 kgs in 2 months with healthy food habits. The evening sessions feel so relaxing—it\'s completely my \'me time\'.',
      author: 'Aarthi R.',
      result: '6kg Weight Loss'
    }
  ];

  // Perfect For
  perfectFor: string[] = [
    'People who wake up with low energy every day',
    'Those with back/neck stiffness and pain',
    'People who feel stressed most of the time',
    'Those who keep saying "I\'ll fix my habits soon"',
    'Anyone starting their health journey and needing structure'
  ];

  // Stats
  stats = [
    { value: '500+', label: 'Students Transformed' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '80%', label: 'Stress Reduction' },
    { value: '42', label: 'Days to Transform' }
  ];

  // Loading state
  isEnrolling = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentSessionService: PaymentSessionService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.setupSEO();
    this.startCountdown();
    this.setupAnimations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSEO(): void {
    // Set page title
    this.title.setTitle('Reset 42 - Transform Your Life in 42 Days | Magical Yoga');

    // Set meta tags for SEO
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Reset your body, calm your mind, and rebuild your habits in 42 days with Reset 42. Live yoga sessions, expert coaching, and personalized guidance. Join 500+ transformed students.' 
    });

    this.meta.updateTag({ 
      name: 'keywords', 
      content: 'yoga program, stress reduction, sleep improvement, habit building, online yoga classes, wellness program, PCOS treatment, back pain relief, weight loss, lifestyle coaching' 
    });

    // Open Graph tags for social media
    this.meta.updateTag({ property: 'og:title', content: 'Reset 42 - Transform Your Life in 42 Days' });
    this.meta.updateTag({ property: 'og:description', content: 'Join 500+ students who transformed their health. Live yoga, expert coaching, and personalized guidance. Starting January 15th.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: '/assets/images/reset42-og-image.jpg' });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Reset 42 - Transform Your Life in 42 Days' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Live yoga sessions, expert coaching, and personalized guidance. Join 500+ transformed students.' });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://magicalyoga.com/reset42' });
  }

  private startCountdown(): void {
    // Initialize countdown immediately
    this.updateCountdown();
    
    // Update every second
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateCountdown();
      });
  }

  private updateCountdown(): void {
    const targetDate = new Date(this.program.startDate);
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      this.timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      // Program has started, show zeros
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  private setupAnimations(): void {
    // Delay to ensure DOM is ready
    setTimeout(() => {
      // Intersection Observer for scroll animations
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Unobserve after animation
                observer.unobserve(entry.target);
              }
            });
          },
          { 
            threshold: 0.1, 
            rootMargin: '0px 0px -100px 0px' // Adjusted for better timing
          }
        );

        // Observe all animate-on-scroll elements
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));
      } else {
        // Fallback for browsers without IntersectionObserver
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => el.classList.add('animate-in'));
      }
    }, 300); // Slightly longer delay to ensure components are rendered
  }

  onEnrollClick(): void {
    if (this.isEnrolling) return;
    
    this.isEnrolling = true;

    try {
      // Check if user is authenticated
      const isAuthenticated = this.authService.isAuthenticated();
      
      // Create payment session
      const sessionId = this.paymentSessionService.createPaymentSession(
        this.program.id,
        this.program.title,
        this.program.price
      );
      
      // Redirect based on authentication status
      if (isAuthenticated) {
        this.router.navigate(['/payment'], {
          queryParams: { 
            session: sessionId,
            program: this.program.id
          }
        });
      } else {
        this.router.navigate(['/register'], {
          queryParams: { 
            session: sessionId,
            redirect: 'payment',
            program: this.program.id
          }
        });
      }
      
    } catch (error) {
      console.error('Enrollment error:', error);
      this.isEnrolling = false;
      
      // Show user-friendly error message
      alert('We encountered an issue while processing your enrollment. Please try again in a moment.');
      
      // Optionally, you could use a toast notification service here
      // this.notificationService.error('Enrollment failed. Please try again.');
    }
  }

  getSavings(): number {
    return this.program.originalPrice - this.program.price;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Update URL hash without scrolling
      history.pushState(null, '', `#${sectionId}`);
    }
  }

  // TrackBy functions for better performance with *ngFor
  trackTestimonial(index: number, testimonial: Testimonial): string {
    return testimonial.author;
  }

  trackOffering(index: number, offering: Offering): string {
    return offering.title;
  }

  trackFeature(index: number, feature: Feature): string {
    return feature.title;
  }

  // Utility method to check if countdown has ended
  get hasCountdownEnded(): boolean {
    const targetDate = new Date(this.program.startDate);
    const now = new Date();
    return targetDate.getTime() <= now.getTime();
  }

  // Method to get formatted start date
  get formattedStartDate(): string {
    const date = new Date(this.program.startDate);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Method to handle retry after error
  retryEnrollment(): void {
    this.isEnrolling = false;
    this.onEnrollClick();
  }
}