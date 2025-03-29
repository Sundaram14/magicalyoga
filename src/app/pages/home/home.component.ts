import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { IntroductionComponent } from '../../components/introduction/introduction.component';
import { AboutFounderComponent } from '../../components/about-founder/about-founder.component';
import { WhyUsComponent } from '../../components/why-us/why-us.component';
import { StudentGalleryComponent } from '../../components/student-gallery/student-gallery.component';
import { WhatsNewComponent } from '../../components/whats-new/whats-new.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, IntroductionComponent, AboutFounderComponent, WhyUsComponent, StudentGalleryComponent, WhatsNewComponent, ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
