import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SummerCampComponent } from './pages/summer-camp/summer-camp.component';
import { VideoContentsComponent } from './pages/video-contents/video-contents.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { IntroductionComponent } from './components/introduction/introduction.component';


export const routes: Routes = [
  {
    path: 'sitemap.xml',
    redirectTo: '/assets/sitemap.xml',
    pathMatch: 'full',
  },
  {
    path: 'robots.txt',
    redirectTo: '/assets/robots.txt',
    pathMatch: 'full',
  },  
  { path: '', component: HomeComponent },
  { path: 'summer-camp', component: SummerCampComponent },
  { path: 'video-contents', component: VideoContentsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: IntroductionComponent},
  { path: '**', redirectTo: '' } // Redirect invalid routes to home
];
