import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { JournalService } from '../../../services/journal.service'; // ADD THIS
import { User } from '../../../models/user.model';
import { UserProfile, ProfileResponse } from '../../../models/profile.model';
import { JournalEntry } from '../../../models/journal.model'; // ADD THIS

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
  private journalService = inject(JournalService);

  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  isLoading = true;
  profileCompletion = 0;
  isBannerMinimized = false;
  recentJournalEntries: JournalEntry[] = []; 

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserProfile();
        this.loadRecentJournalEntries(); 
      } else {
        this.isLoading = false;
      }
    });
  }

  private loadRecentJournalEntries(): void {
    this.journalService.getRecentEntries().subscribe({
      next: (entries: JournalEntry[]) => {
        this.recentJournalEntries = entries;
      },
      error: (error: any) => {
        console.error('Error loading recent journal entries:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  getLatestEntryDate(): string {
  if (this.recentJournalEntries.length === 0) return '--';
  
  const latest = this.recentJournalEntries[0]; // Already sorted by date
  return new Date(latest.entryDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

getTotalWords(): number {
  if (this.recentJournalEntries.length === 0) return 0;
  
  return this.recentJournalEntries.reduce((total, entry) => {
    return total + (entry.content?.split(/\s+/).length || 0);
  }, 0);
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

  private calculateProfileCompletion(profileResponse?: ProfileResponse): void {
    if (!this.currentUser) {
      this.profileCompletion = 0;
      return;
    }

    let completedFields = 0;
    const totalFields = 8;

    // Profile fields from UserProfile
    if (this.userProfile?.gender?.trim()) completedFields++;
    if (this.userProfile?.dateOfBirth) completedFields++;
    if (this.userProfile?.yogaExperienceLevel?.trim()) completedFields++;
    if (this.userProfile?.healthGoals?.trim()) completedFields++;
    
    // Optional fields
    if (this.userProfile?.height) completedFields++;
    if (this.userProfile?.weight) completedFields++;
    if (this.userProfile?.medicalConditions?.trim()) completedFields++;
    if (this.userProfile?.ongoingMedications?.trim()) completedFields++;

    this.profileCompletion = Math.round((completedFields / totalFields) * 100);
    
    if (this.profileCompletion > 100) {
      this.profileCompletion = 100;
    }
  }

  get isProfileComplete(): boolean {
    return this.profileCompletion === 100;
  }

  get isProfilePartial(): boolean {
    return this.profileCompletion > 0 && this.profileCompletion < 100;
  }

  logout(): void {
    this.authService.logout();
  }
}