import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';
import { JournalListComponent } from './pages/journal/journal-list/journal-list.component';
import { JournalFormComponent } from './pages/journal/journal-form/journal-form.component';
import { JournalDetailComponent } from './pages/journal/journal-detail/journal-detail.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PaymentStatusComponent } from './components/payment-status/payment-status.component';

export const routes: Routes = [
  // Default route to /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Legal Pages
  {
    path: 'legal',
    children: [
      {
        path: 'refund',
        loadComponent: () => import('./pages/legal-pages/legal-pages.component').then(m => m.LegalPagesComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/legal-pages/legal-pages.component').then(m => m.LegalPagesComponent)
      },
      {
        path: 'shipping',
        loadComponent: () => import('./pages/legal-pages/legal-pages.component').then(m => m.LegalPagesComponent)
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/legal-pages/legal-pages.component').then(m => m.LegalPagesComponent)
      },
      {
        path: '',
        redirectTo: 'terms',
        pathMatch: 'full'
      }
    ]
  },

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
  
  // Admin Routes
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard], // Both guards
    children: [
      // Admin Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      
      // Admin Users
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/admin/admin-users/admin-users.component')
              .then(m => m.AdminUsersComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./components/admin/admin-user-details/admin-user-details.component')
              .then(m => m.AdminUserDetailsComponent)
          }
        ]
      },
      
      // Admin Recordings
      {
        path: 'recordings',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/admin/admin-recordings/admin-recordings.component')
              .then(m => m.AdminRecordingsComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./components/admin/admin-recording-form/admin-recording-form.component')
              .then(m => m.AdminRecordingFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./components/admin/admin-recording-form/admin-recording-form.component')
              .then(m => m.AdminRecordingFormComponent)
          }
        ]
      },
      
      // Default admin route
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      
      // Catch-all for admin section
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  
  // Public Pages
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) 
  },
  { 
    path: 'reset42', 
    loadComponent: () => import('./pages/reset42-landing/reset42-landing.component').then(m => m.Reset42LandingComponent) 
  },
  
  // Optional pages (currently commented out)
  // { 
  //   path: 'about', 
  //   loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) 
  // },
  // { 
  //   path: 'classes', 
  //   loadComponent: () => import('./pages/classes/classes.component').then(m => m.ClassesComponent) 
  // },
  // { 
  //   path: 'shop', 
  //   loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent) 
  // },

  // Journal Routes (non-lazy loaded)
  { 
    path: 'journal', 
    component: JournalListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'journal/new', 
    component: JournalFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'journal/edit/:id', 
    component: JournalFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'journal/:id', 
    component: JournalDetailComponent,
    canActivate: [authGuard]
  },

  // Payment Routes
  { 
    path: 'payment', 
    component: PaymentComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'payment-status', 
    component: PaymentStatusComponent 
  },

  // Wildcard route - redirect to home instead of dashboard
  { 
    path: '**', 
    redirectTo: '/home' 
  }
];