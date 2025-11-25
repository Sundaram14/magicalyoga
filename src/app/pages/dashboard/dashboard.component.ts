import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserProfile, ProfileResponse } from '../../../models/profile.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  isLoading = true;
  profileCompletion = 0;
  isBannerMinimized = false;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserProfile();
      } else {
        this.isLoading = false;
      }
    });
  }

  toggleBanner(): void {
    this.isBannerMinimized = !this.isBannerMinimized;
  }

  private loadUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profileResponse: ProfileResponse) => {
        this.userProfile = profileResponse.profile || null;
        this.calculateProfileCompletion(profileResponse);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
        this.userProfile = null;
        this.calculateProfileCompletion();
        this.isLoading = false;
      }
    });
  }

  // Fixed profile completion calculation
  private calculateProfileCompletion(profileResponse?: ProfileResponse): void {
    if (!this.currentUser) {
      this.profileCompletion = 0;
      return;
    }

    let completedFields = 0;
    const totalFields = 8;

    // Basic user fields (from Users table)
    if (this.currentUser.firstName?.trim()) completedFields++;
    if (this.currentUser.lastName?.trim()) completedFields++;
    if (this.currentUser.email?.trim()) completedFields++;
    
    // Profile fields (from UserProfiles table)
    if (this.userProfile?.gender?.trim()) completedFields++;
    if (this.userProfile?.dateOfBirth) completedFields++;
    if (this.userProfile?.yogaExperienceLevel?.trim()) completedFields++;
    if (this.userProfile?.healthGoals?.trim()) completedFields++;

    this.profileCompletion = Math.round((completedFields / totalFields) * 100);
    
    if (this.profileCompletion > 100) {
      this.profileCompletion = 100;
    }
  }

  // Check if profile is fully completed
  get isProfileComplete(): boolean {
    return this.profileCompletion === 100;
  }

  // Check if profile is partially completed
  get isProfilePartial(): boolean {
    return this.profileCompletion > 0 && this.profileCompletion < 100;
  }

  logout(): void {
    this.authService.logout();
  }
}