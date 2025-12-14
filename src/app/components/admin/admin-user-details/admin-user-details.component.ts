import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { AdminUserDetails } from '../../../../models/admin-user.model';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.css']
})
export class AdminUserDetailsComponent implements OnInit {
  user: AdminUserDetails | null = null;
  isLoading = true;
  error: string | null = null;
  activeTab: 'profile' | 'memberships' | 'journals' = 'profile';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    console.log('Loading user details...');
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.error = 'User ID not found';
      this.isLoading = false;
      return;
    }

    console.log('Fetching details for user ID:', userId);

    this.isLoading = true;
    this.error = null;

    this.adminService.getUserDetails(userId).subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.error = 'Failed to load user details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /* =========================
     SAFE GETTERS (IMPORTANT)
     ========================= */

  get fullName(): string {
    if (!this.user) return 'No Name';
    return `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim() || 'No Name';
  }

  get dateOfBirth(): string | undefined {
    return this.user?.profile?.dateOfBirth;
  }

  get height(): number | undefined {
    return this.user?.profile?.height;
  }

  get weight(): number | undefined {
    return this.user?.profile?.weight;
  }

  /* =========================
     FORMATTERS
     ========================= */

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatSimpleDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  calculateAge(dateOfBirth: string | undefined): string {
    if (!dateOfBirth) return 'N/A';

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
  }

  calculateDaysRemaining(endDate: string | undefined): number {
    if (!endDate) return 0;

    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /* =========================
     TABS & COUNTS
     ========================= */

  setActiveTab(tab: 'profile' | 'memberships' | 'journals'): void {
    this.activeTab = tab;
  }

  getMembershipsCount(): number {
    return this.user?.memberships?.length || 0;
  }

  getJournalsCount(): number {
    return this.user?.recentJournals?.length || 0;
  }
}
