import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  text: string;
  author: string;
  result: string;
  avatar?: string;
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css']
})
export class TestimonialsSectionComponent implements OnInit, OnDestroy {
  testimonials: Testimonial[] = [
    {
      text: "Hi Master Sundaram, it’s been a 2-month journey and still going strong. Consistency comes from understanding and enjoying the process, and I’ve felt both because of you. You’re not just an instructor but a great teacher who clearly explains what to do, how to do it, and what to avoid. Your polite and friendly approach makes it easy to reach out for any clarification.",
      author: "Reset42 Student",
      result: "Weight Loss"
    },
    {
      text: "Because of your MAGICAL YOGA Class, two magical things happened in my life which I never thought will happen: my thyroid level came into control and I lost 1kg weight. Really getting you as our tutor is god sent gift. Thank you!",
      author: "Reset42 Graduate",
      result: "Health Recovery"
    },
    {
      text: "Honestly, I didn't expect results this fast. My PCOS improved, my mood is stable, and my energy levels are way better than last year. Your classes became the only thing I look forward to daily. Grateful!",
      author: "PCOS Warrior",
      result: "PCOS Improvement"
    },
    {
      text: "Everyday evening time feels so relaxing. Whole day there's some chaos always either with my body or the stress around. But at 6:30 it's like completely me time. Gandhimathi is so sweet, so much patience and calm. So much contentment!",
      author: "Regular Practitioner",
      result: "Stress Relief"
    },
    {
      text: "I have come to your class with a heavy lower back pain which was there for more than 10 years and I was not able to sit comfortably on the floor. Now just after 1 month of class I am feeling much relieved, I am able to sit down for some time, and the back pain has almost vanished! All thanks to you and will continue practicing yoga.",
      author: "Chronic Pain Sufferer",
      result: "Pain Relief"
    },
    {
      text: "With these habits of mine, I lost 2 kg after 26 days! I have also lost 6 kgs in the last 2 months with healthy food and continue it. Happy to see our improvements and thank you for your guidance.",
      author: "Weight Loss Journey",
      result: "6kg Lost"
    },
    {
      text: "I'm honestly thankful for this group and all the kind people around me. I have been able to sleep around 12 most days of the week due to this weekly goal setting. This program has improved my sleep patterns significantly.",
      author: "Better Sleeper",
      result: "Sleep Improvement"
    }
  ];

  currentSlide = 0;
  slidesToShow = 3;
  private autoplayInterval: any;
  autoplayDelay = 5000; // 5 seconds

  ngOnInit() {
    this.startAutoplay();
    this.updateSlidesToShow();
    window.addEventListener('resize', this.updateSlidesToShow.bind(this));
  }

  ngOnDestroy() {
    this.stopAutoplay();
    window.removeEventListener('resize', this.updateSlidesToShow.bind(this));
  }

  updateSlidesToShow() {
    if (window.innerWidth < 768) {
      this.slidesToShow = 1;
    } else if (window.innerWidth < 1024) {
      this.slidesToShow = 2;
    } else {
      this.slidesToShow = 3;
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  nextSlide() {
    const totalSlides = this.testimonials.length;
    const maxSlide = Math.max(0, totalSlides - this.slidesToShow);
    
    if (this.currentSlide < maxSlide) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // Loop back to start
    }
    
    this.restartAutoplay();
  }

  prevSlide() {
    const totalSlides = this.testimonials.length;
    const maxSlide = Math.max(0, totalSlides - this.slidesToShow);
    
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = maxSlide; // Loop to end
    }
    
    this.restartAutoplay();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.restartAutoplay();
  }

  restartAutoplay() {
    this.startAutoplay();
  }

  getVisibleSlides(): number {
    return this.slidesToShow;
  }

  getTotalVisibleSlides(): number {
    return Math.max(0, this.testimonials.length - this.slidesToShow + 1);
  }

  trackByTestimonial(index: number, testimonial: Testimonial): string {
    return testimonial.author + index;
  }
}