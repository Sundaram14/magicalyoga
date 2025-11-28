import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { JournalListComponent } from './pages/journal/journal-list/journal-list.component';
import { JournalFormComponent } from './pages/journal/journal-form/journal-form.component';
import { JournalDetailComponent } from './pages/journal/journal-detail/journal-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Public Routes (No Header)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) 
  },
  
  // Protected Routes (With Header)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  
  // Your Existing Public Pages
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },

      { 
    path: 'about', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'reset42', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'classes', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'shop', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },

  //   { 
  //   path: 'about', 
  //   loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) 
  // },
  // { 
  //   path: 'contact', 
  //   loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) 
  // },
  // { 
  //   path: 'reset42', 
  //   loadComponent: () => import('./pages/reset42/reset42.component').then(m => m.Reset42Component) 
  // },
  // { 
  //   path: 'classes', 
  //   loadComponent: () => import('./pages/classes/classes.component').then(m => m.ClassesComponent) 
  // },
  // { 
  //   path: 'shop', 
  //   loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent) 
  // },

  { path: 'journal', component: JournalListComponent },
  { path: 'journal/new', component: JournalFormComponent },
  { path: 'journal/edit/:id', component: JournalFormComponent },
  { path: 'journal/:id', component: JournalDetailComponent },
  
  { path: '**', redirectTo: '/dashboard' }
];