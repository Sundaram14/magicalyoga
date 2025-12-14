import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { JournalService } from '../../../services/journal.service';
import { MembershipService, Membership } from '../../../services/membership.service';
import { Recording } from '../../../models/recording.model';
import { User } from '../../../models/user.model';
import { UserProfile, ProfileResponse } from '../../../models/profile.model';
import { JournalEntry } from '../../../models/journal.model';
import { WhatsappSuccessModalComponent } from '../../components/whatsapp-success-modal/whatsapp-success-modal.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WhatsappSuccessModalComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private journalService = inject(JournalService);
  private membershipService = inject(MembershipService);
  private sanitizer = inject(DomSanitizer);

  // user / profile
  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  isLoading = true;
  profileCompletion = 0;
  isBannerMinimized = false;

  // journal
  recentJournalEntries: JournalEntry[] = [];

  // memberships
  memberships: Membership[] = [];
  membershipsLoading = false;

  // recordings
  recordings: Recording[] = [];
  recordingsLoading = false;
  recordingsByProgram: Record<string, Recording[]> = {};
  selectedProgramForRecordings: string | null = null;
  selectedProgramName: string = '--';

  // player state
  selectedRecording: Recording | null = null;
  embedUrl: SafeResourceUrl | null = null;
  isPlayerOpen = false;

  // whatsapp modal
  showSuccessModal = false;
  successModalTitle = '';
  successModalMessage = '';
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

  private loadMemberships(): void {
    this.membershipsLoading = true;
    this.membershipService.getMyMemberships().subscribe({
      next: (response) => {
        this.memberships = (response && (response as any).memberships) ? (response as any).memberships : (response as any) || [];
        this.membershipsLoading = false;
        if (this.memberships.length > 0) this.loadRecordings();
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.memberships = [];
        this.membershipsLoading = false;
      }
    });
  }

  private loadRecordings(): void {
    this.recordingsLoading = true;
    this.membershipService.getRecordings().subscribe({
      next: (list: Recording[]) => {
        this.recordings = Array.isArray(list) ? list : [];
        this.recordingsByProgram = {};
        for (const r of this.recordings) {
          const pid = r.programId ?? 'unknown';
          if (!this.recordingsByProgram[pid]) this.recordingsByProgram[pid] = [];
          this.recordingsByProgram[pid].push(r);
        }
        for (const pid of Object.keys(this.recordingsByProgram)) {
          this.recordingsByProgram[pid].sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0));
        }
        this.recordingsLoading = false;
      },
      error: (err) => {
        console.error('Error loading recordings:', err);
        this.recordings = [];
        this.recordingsByProgram = {};
        this.recordingsLoading = false;
      }
    });
  }

  openRecordingsForProgram(programId: string) {
    if (!programId) return;

    this.selectedProgramForRecordings = programId;

    const membership = this.memberships.find(m => (m as any).programId === programId);
    if (membership && (membership as any).programName) {
      this.selectedProgramName = (membership as any).programName;
    } else {
      const rec = this.recordingsByProgram[programId]?.[0];
      this.selectedProgramName = rec?.programName ?? '--';
    }

    if (!this.recordings || this.recordings.length === 0) this.loadRecordings();

    setTimeout(() => {
      const el = document.getElementById('recordings-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // play inside embedded player
  playRecording(rec: Recording) {
    if (!rec?.youtubeVideoId) return;
    this.selectedRecording = rec;
    const url = `https://www.youtube.com/embed/${rec.youtubeVideoId}?autoplay=1&rel=0`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isPlayerOpen = true;
    setTimeout(() => {
      const el = document.getElementById('recordings-player');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  closePlayer() {
    this.isPlayerOpen = false;
    this.embedUrl = null;
    this.selectedRecording = null;
  }

  closeRecordingsPanel() {
    this.selectedProgramForRecordings = null;
    this.selectedProgramName = '--';
    this.closePlayer();
  }

  getRecordingsForProgram(programId: string | null): Recording[] {
    if (!programId) return [];
    return this.recordingsByProgram[programId] ?? [];
  }

  confirmWhatsAppJoin(programId: string): void {
    const membership = this.memberships.find(m => (m as any).programId === programId);
    if (!membership) return;

    this.membershipService.confirmWhatsAppJoin(programId).subscribe({
      next: (response) => {
        (membership as any).whatsAppJoined = true;
        (membership as any).whatsAppJoinDate = response?.whatsAppJoinDate ?? new Date().toISOString();

        this.selectedMembership = membership;
        this.successModalTitle = 'WhatsApp Group Joined! 🎉';
        this.successModalMessage = 'You now have full access to all class content, recordings, and instructor support.';
        this.showSuccessModal = true;
      },
      error: (error) => {
        console.error('Error confirming WhatsApp join:', error);
        alert('Failed to confirm WhatsApp join. Please try again.');
      }
    });
  }

  onModalClosed(): void {
    this.showSuccessModal = false;
    this.selectedMembership = null;
  }

  getActiveMemberships(): Membership[] {
    return this.memberships.filter(m =>
      (m as any).status === 'active' &&
      (!(m as any).endDate || new Date((m as any).endDate) > new Date()) &&
      !(m as any).accessRevoked
    );
  }

  getMembershipsWithFullAccess(): Membership[] {
    return this.getActiveMemberships().filter(m => (m as any).whatsAppJoined);
  }

  getMembershipsNeedingWhatsApp(): Membership[] {
    return this.getActiveMemberships().filter(m => !(m as any).whatsAppJoined);
  }

  get activeMembershipsCount(): number {
    return this.getActiveMemberships().length;
  }

  get fullAccessMembershipsCount(): number {
    return this.getMembershipsWithFullAccess().length;
  }

  private loadRecentJournalEntries(): void {
    this.journalService.getRecentEntries().subscribe({
      next: (entries: JournalEntry[]) => {
        this.recentJournalEntries = entries ?? [];
      },
      error: (error: any) => {
        console.error('Error loading recent journal entries:', error);
        this.recentJournalEntries = [];
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
      !( (m as any).status === 'active' &&
         (!(m as any).endDate || new Date((m as any).endDate) > new Date()) &&
         !(m as any).accessRevoked)
    );
  }

  get hasInactiveMemberships(): boolean {
    return !this.membershipsLoading && this.inactiveMemberships.length > 0;
  }

  get hasActiveMemberships(): boolean {
    return !this.membershipsLoading && this.memberships.length > 0;
  }

  getNewEnrollments(): Membership[] {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    return this.getMembershipsNeedingWhatsApp().filter(membership => {
      const enrollmentDate = new Date((membership as any).startDate);
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