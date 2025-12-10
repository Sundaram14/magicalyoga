import { Component, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sticky-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sticky-cta.component.html',
  styleUrls: ['./sticky-cta.component.css']
})
export class StickyCtaComponent implements OnDestroy {
  @Input() isEnrolling = false;
  @Output() enrollClick = new EventEmitter<void>();
  
  isVisible = false;
  private scrollTimeout: any;
  private lastScrollPosition = 0;
  private scrollThreshold = 300;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollPosition > this.scrollThreshold) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
    
    if (scrollPosition < this.lastScrollPosition && scrollPosition < 100) {
      this.isVisible = false;
    }
    
    this.lastScrollPosition = scrollPosition;
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {}, 100);
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  onEnrollClick(): void {
    this.enrollClick.emit();
  }
}