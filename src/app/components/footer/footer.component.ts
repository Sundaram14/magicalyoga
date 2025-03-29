import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) {}

  goToSpecificAbout() {
    this.router.navigate(['/about-us']); // Redirects to "specific" route
  }
}
