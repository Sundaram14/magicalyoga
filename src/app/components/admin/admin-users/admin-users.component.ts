import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { AdminUser } from '../../../../models/admin-user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Search and filters
  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;
  pageInput: number = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    // Build query parameters
    const params: any = {
      page: this.currentPage,
      pageSize: this.pageSize
    };
    
    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }
    
    if (this.selectedRole) {
      params.isAdmin = this.selectedRole === 'admin';
    }
    
    if (this.selectedStatus) {
      params.isActive = this.selectedStatus === 'active';
    }
    
    this.adminService.getUsers(params.page, params.pageSize, params.search, params.isAdmin).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        
        // Handle API response
        if (Array.isArray(response)) {
          this.users = response.map(user => this.mapApiUserToModel(user));
          this.totalItems = response.length;
          this.totalPages = Math.ceil(response.length / this.pageSize);
        } else if (response && response.users) {
          this.users = response.users.map((user: any) => this.mapApiUserToModel(user));
          this.totalPages = response.pagination?.totalPages || 1;
          this.totalItems = response.pagination?.total || response.users.length;
        } else {
          this.users = [];
          this.totalItems = 0;
          this.totalPages = 1;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = error.message || 'Failed to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private mapApiUserToModel(apiUser: any): AdminUser {
    return {
      ...apiUser,
      // Ensure all required fields exist
      role: apiUser.role || 'user',
      isActive: apiUser.isActive !== undefined ? apiUser.isActive : true,
      isProfileCompleted: apiUser.isProfileCompleted || false,
      fullName: this.getFullName(apiUser),
      activeMemberships: apiUser.activeMemberships || 0,
      totalSpent: apiUser.totalSpent || 0
    };
  }

  // Search functionality
  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  // Filter functionality
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery || !!this.selectedRole || !!this.selectedStatus;
  }

  // Pagination functionality
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.pageInput = page;
    this.loadUsers();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Helper methods
  getFullName(user: any): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return 'No Name';
  }

  getUserInitials(user: AdminUser): string {
    const fullName = this.getFullName(user);
    if (fullName !== 'No Name') {
      return fullName.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}