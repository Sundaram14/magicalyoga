import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true, // Add this for standalone components
  imports: [CommonModule, RouterModule], // Add required imports here
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'] // Correct property name (plural)
})
export class FooterComponent {
  constructor(private router: Router) {}

  goToSpecificAbout(): void {
    this.router.navigate(['/about-us']); // Make sure this route exists in your app.routes.ts
  }
}