// dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { JournalService } from '../../../services/journal.service';
import { MembershipService, Membership } from '../../../services/membership.service'; 
import { User } from '../../../models/user.model';
import { UserProfile, ProfileResponse } from '../../../models/profile.model';
import { JournalEntry } from '../../../models/journal.model';
import { WhatsappSuccessModalComponent } from '../../components/whatsapp-success-modal/whatsapp-success-modal.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WhatsappSuccessModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private journalService = inject(JournalService);
  private membershipService = inject(MembershipService);

  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  isLoading = true;
  profileCompletion = 0;
  isBannerMinimized = false;
  recentJournalEntries: JournalEntry[] = [];
  memberships: Membership[] = [];
  membershipsLoading = false; 
  showSuccessModal: boolean = false;
  successModalTitle: string = '';
  successModalMessage: string = '';
  selectedMembership: Membership | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserProfile();
        this.loadRecentJournalEntries();
        this.loadMemberships(); 
      } else {
        this.isLoading = false;
      }
    });
  }

  // ADD THIS METHOD
  private loadMemberships(): void {
    this.membershipsLoading = true;
    this.membershipService.getMyMemberships().subscribe({
      next: (response) => {
        this.memberships = response.memberships;
        this.membershipsLoading = false;
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.membershipsLoading = false;
      }
    });
  }

// UPDATE THE WHATSAPP CONFIRMATION METHOD
  confirmWhatsAppJoin(programId: string): void {
    const membership = this.memberships.find(m => m.programId === programId);
    if (!membership) return;

    this.membershipService.confirmWhatsAppJoin(programId).subscribe({
      next: (response) => {
        // Update local membership state
        membership.whatsAppJoined = true;
        membership.whatsAppJoinDate = response.whatsAppJoinDate;
        
        // Show success modal instead of alert
        this.selectedMembership = membership;
        this.successModalTitle = 'WhatsApp Group Joined! 🎉';
        this.successModalMessage = 'You now have full access to all class content, recordings, and instructor support.';
        this.showSuccessModal = true;
      },
      error: (error) => {
        console.error('Error confirming WhatsApp join:', error);
        // You could also create an error modal here
        alert('Failed to confirm WhatsApp join. Please try again.');
      }
    });
  }
  // ADD METHOD TO CLOSE MODAL
  onModalClosed(): void {
    this.showSuccessModal = false;
    this.selectedMembership = null;
  }

  // In dashboard.component.ts - Update the methods
  getActiveMemberships(): Membership[] {
    return this.memberships.filter(m => 
      m.status === 'active' && 
      (!m.endDate || new Date(m.endDate) > new Date()) &&
      !m.accessRevoked
    );
  }

  getMembershipsWithFullAccess(): Membership[] {
    return this.getActiveMemberships().filter(m => m.whatsAppJoined);
  }

  getMembershipsNeedingWhatsApp(): Membership[] {
    return this.getActiveMemberships().filter(m => !m.whatsAppJoined);
  }

  get activeMembershipsCount(): number {
    return this.getActiveMemberships().length;
  }

  get fullAccessMembershipsCount(): number {
    return this.getMembershipsWithFullAccess().length;
  }

  // ... rest of your existing methods remain the same ...
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

  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return '--';
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
    const latest = this.recentJournalEntries[0];
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

    if (this.userProfile?.gender?.trim()) completedFields++;
    if (this.userProfile?.dateOfBirth) completedFields++;
    if (this.userProfile?.yogaExperienceLevel?.trim()) completedFields++;
    if (this.userProfile?.healthGoals?.trim()) completedFields++;
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

  get inactiveMemberships(): Membership[] {
    return this.memberships.filter(m => 
      !(m.status === 'active' && 
        (!m.endDate || new Date(m.endDate) > new Date()) &&
        !m.accessRevoked)
    );
  }

  get hasInactiveMemberships(): boolean {
    return !this.membershipsLoading && this.inactiveMemberships.length > 0;
  }

  get hasActiveMemberships(): boolean {
    return !this.membershipsLoading && this.memberships.length > 0;
  }

  getNewEnrollments(): Membership[] {
    // Show enrollments from last 24 hours that need WhatsApp
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    return this.getMembershipsNeedingWhatsApp().filter(membership => {
      const enrollmentDate = new Date(membership.startDate);
      return enrollmentDate > twentyFourHoursAgo;
    });
  }

  hasNewEnrollments(): boolean {
    return this.getNewEnrollments().length > 0;
  }
  logout(): void {
    this.authService.logout();
  }
}