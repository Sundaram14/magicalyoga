import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-whats-new',
  imports: [],
  templateUrl: './whats-new.component.html',
  styleUrl: './whats-new.component.css'
})
export class WhatsNewComponent{

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}
  

  navigateToSummerCamp(): void {
    this.router.navigate(['/summer-camp']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
    });
  }
}
