import { Component, Input, Output, EventEmitter, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-section.component.html',
  styleUrls: ['./timeline-section.component.css']
})
export class TimelineSectionComponent implements AfterViewInit, OnDestroy {
  @Input() isEnrolling = false;
  @Output() enrollClick = new EventEmitter<void>();

  activePhase: number = 1;
  scrollProgress = 0;
  
  private scrollTimeout: any;
  private resizeTimeout: any;
  private headerOffset = 120;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupScrollTracking();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  private setupScrollTracking(): void {
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onScroll(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {
      this.updateActivePhase();
      this.updateScrollProgress();
    }, 100);
  }

  private onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.updateActivePhase();
    }, 250);
  }

  private updateActivePhase(): void {
    const cards = document.querySelectorAll('.timeline-card');
    if (cards.length === 0) return;

    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const viewportMiddle = scrollY + (viewportHeight / 2);
    
    let closestCardIndex = 0;
    let smallestDistance = Infinity;
    
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardTop = scrollY + rect.top;
      const cardMiddle = cardTop + (rect.height / 2);
      
      const distance = Math.abs(viewportMiddle - cardMiddle);
      
      if (distance < viewportHeight * 0.4) {
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestCardIndex = index + 1;
        }
      }
    });
    
    if (closestCardIndex === 0) {
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardTop = scrollY + rect.top;
        const cardMiddle = cardTop + (rect.height / 2);
        const distance = Math.abs(viewportMiddle - cardMiddle);
        
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestCardIndex = index + 1;
        }
      });
    }
    
    if (closestCardIndex > 0) {
      this.activePhase = closestCardIndex;
    }
  }

  private updateScrollProgress(): void {
    const timelineSection = document.querySelector('.timeline-section');
    if (!timelineSection) return;

    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    const sectionTop = timelineSection.getBoundingClientRect().top + scrollY;
    
    const progress = ((scrollY + windowHeight - sectionTop) / (rect.height + windowHeight)) * 100;
    
    this.scrollProgress = Math.min(100, Math.max(0, progress));
  }

  goToPhase(phase: number): void {
    this.activePhase = phase;
    this.scrollToPhase(phase);
  }

  private scrollToPhase(phase: number): void {
    const element = document.querySelector(`.timeline-card:nth-child(${phase})`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const targetScroll = window.scrollY + rect.top - this.headerOffset - 50;
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  scrollToPricing(): void {
    const pricingElement = document.querySelector('app-pricing-section');
    if (pricingElement) {
      const rect = pricingElement.getBoundingClientRect();
      const targetScroll = window.scrollY + rect.top - this.headerOffset;
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  onEnrollClick(): void {
    this.enrollClick.emit();
  }
}