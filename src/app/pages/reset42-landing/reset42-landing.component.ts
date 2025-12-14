import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Components
import { HeroSectionComponent } from '../../components/Reset42/hero-section/hero-section.component';
import { StatsBarComponent } from '../../components/Reset42/stats-bar/stats-bar.component';
import { TimelineSectionComponent } from '../../components/Reset42/timeline-section/timeline-section.component';
import { FeaturesSectionComponent } from '../../components/Reset42/features-section/features-section.component';
import { OfferingsSectionComponent } from '../../components/Reset42/offerings-section/offerings-section.component';
import { TestimonialsSectionComponent } from '../../components/Reset42/testimonials-section/testimonials-section.component';
import { PricingSectionComponent } from '../../components/Reset42/pricing-section/pricing-section.component';
import { FaqSectionComponent } from '../../components/Reset42/faq-section/faq-section.component';
import { StickyCtaComponent } from '../../components/Reset42/sticky-cta/sticky-cta.component';
import { FooterComponent } from '../../components/footer/footer.component'; 

// Services - Adjust paths according to your structure
import { AuthService } from '../../../services/auth.service';
import { PaymentSessionService } from '../../../services/payment-session.service';

@Component({
  selector: 'app-reset42-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    StatsBarComponent,
    TimelineSectionComponent,
    FeaturesSectionComponent,
    OfferingsSectionComponent,
    TestimonialsSectionComponent,
    PricingSectionComponent,
    FaqSectionComponent,
    StickyCtaComponent,
    FooterComponent
  ],
  templateUrl: './reset42-landing.component.html',
  styleUrls: ['./reset42-landing.component.css']
})
export class Reset42LandingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Program Data - Set future date for countdown
  program = {
    id: '09a1c14a-ff26-4855-af76-2e52e05de0c0',
    title: 'Reset 42 - Transformational Program',
    price: 999,
    originalPrice: 14000,
    startDate: new Date().toISOString()
  };

  // Countdown Timer
  timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  // Stats
  stats = [
    { value: '500+', label: 'Students Transformed' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '80%', label: 'Stress Reduction' },
    { value: '42', label: 'Days to Transform' }
  ];

  // Features
  features = [
    {
      icon: 'fas fa-heartbeat',
      title: 'Sleep Cycle Reset',
      description: 'Naturally restore your circadian rhythm',
      color: '#0097b2'
    },
    {
      icon: 'fas fa-brain',
      title: 'Stress Reduction',
      description: 'Reduce stress by up to 80%',
      color: '#005f73'
    },
    {
      icon: 'fas fa-bullseye',
      title: 'Diet Clarity',
      description: 'Build sustainable food habits',
      color: '#00c9ff'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Mobility & Posture',
      description: 'Transform your physical alignment',
      color: '#0097b2'
    },
    {
      icon: 'fas fa-award',
      title: 'Mind Control',
      description: 'Develop daily discipline',
      color: '#005f73'
    }
  ];

  // Offerings
  offerings = [
    {
      icon: 'fas fa-calendar-alt',
      title: '30 Live Yoga Sessions',
      description: 'Mon–Fri, 7:30–8:30 AM IST. Real-time participation for maximum benefit.',
      highlight: true,
      features: ['Live instruction', 'Real-time corrections', 'Group energy']
    },
    {
      icon: 'fas fa-users',
      title: '6 Coaching Classes',
      description: 'Expert lifestyle coaching with downloadable recordings',
      highlight: false,
      features: ['Recorded sessions', 'Downloadable content', 'Lifetime access']
    },
    {
      icon: 'fas fa-comments',
      title: 'Fortnightly 1:1 Calls',
      description: 'Personalized guidance—30 min every two weeks',
      highlight: false,
      features: ['Personalized advice', 'Progress tracking', 'Goal setting']
    }
  ];

  // Testimonials
  testimonials = [
    {
      text: 'After 10+ years of chronic back pain, I can now sit comfortably on the floor. The pain has almost vanished in just one month!',
      author: 'Rajesh K.',
      result: 'Chronic Pain Relief',
      avatar: 'RK',
      rating: 5
    },
    {
      text: 'My PCOS improved, my mood is stable, and my energy levels are way better than last year. Your classes became the only thing I look forward to daily.',
      author: 'Priya M.',
      result: 'PCOS Improved',
      avatar: 'PM',
      rating: 5
    }
  ];

  // State
  isEnrolling = false;
  showStickyCTA = false; // Added missing property

  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentSessionService: PaymentSessionService
  ) {}

  ngOnInit(): void {
    this.startCountdown();
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startCountdown(): void {
    this.updateCountdown();
    
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
      this.timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  private setupScrollAnimations(): void {
    // Setup Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        { threshold: 0.1 }
      );

      // Wait for DOM to be ready
      setTimeout(() => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));
      }, 500);
    }
  }

  onEnrollClick(): void {
    if (this.isEnrolling) return;
    
    this.isEnrolling = true;
    
    try {
      // Create payment session for Reset 42
      const sessionId = this.paymentSessionService.createPaymentSession(
        this.program.id,
        this.program.title,
        this.program.price,
      );
      
      // Check if user is authenticated
      const isAuthenticated = this.authService.isAuthenticated();
      
      if (isAuthenticated) {
        // User is logged in - go directly to payment
        this.router.navigate(['/payment'], {
          queryParams: { 
            session: sessionId,
            program: this.program.id
          }
        });
      } else {
        // User not logged in - redirect to register first
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
      alert('We encountered an issue while processing your enrollment. Please try again.');
    }
  }

  // Host listener for scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.showStickyCTA = scrollPosition > 500;
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
    }
  }

  // Helper method to share the program
  shareProgram(): void {
    const shareText = `Join Reset 42 - Transform your life in 42 days! Only ₹${this.program.price}.`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Reset 42 - Magical Yoga',
        text: shareText,
        url: shareUrl
      }).catch(error => {
        console.log('Share cancelled or failed:', error);
      });
    } else if (navigator.clipboard) {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText + ' ' + shareUrl)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          // Fallback to old method
          this.fallbackCopyToClipboard(shareText + ' ' + shareUrl);
        });
    } else {
      // Final fallback
      this.fallbackCopyToClipboard(shareText + ' ' + shareUrl);
    }
  }

  // Fallback copy method for older browsers
  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('Please copy this link manually: ' + text);
    }
    
    document.body.removeChild(textArea);
  }
}