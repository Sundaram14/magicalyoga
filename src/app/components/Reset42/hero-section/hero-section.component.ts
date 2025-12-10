import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  @Input() isEnrolling = false;
  @Output() enrollClick = new EventEmitter<void>();

  // Countdown timer
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startCountdown(): void {
    // Set target date: December 15, 2025, 7:30 AM IST
    const targetDate = new Date('2025-12-15T07:30:00+05:30');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        this.minutes = Math.floor((difference / 1000 / 60) % 60);
        this.seconds = Math.floor((difference / 1000) % 60);
      } else {
        // Program has started
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      }
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        updateCountdown();
      });
  }

  getDigits(num: number): string[] {
    return num.toString().padStart(2, '0').split('');
  }

  getSavings(): number {
    return 14000 - 6499; // Hardcoded for now
  }

  onEnrollClick(): void {
    this.enrollClick.emit();
  }
}