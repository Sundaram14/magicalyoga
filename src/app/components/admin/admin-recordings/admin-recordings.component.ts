import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, Recording } from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-recordings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-recordings.component.html',
  styleUrls: ['./admin-recordings.component.css']
})
export class AdminRecordingsComponent implements OnInit {
  recordings: Recording[] = [];
  filteredRecordings: Recording[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Search and filter
  searchQuery = '';
  programFilter = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  
  // Programs list (you might want to fetch this from API)
  programs = [
    { id: '09a1c14a-ff26-4855-af76-2e52e05de0c0', name: 'Reset 42 - Transformational Program' }

  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRecordings();
  }

  loadRecordings(): void {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getRecordings().subscribe({
      next: (recordings) => {
        this.recordings = recordings;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recordings:', error);
        this.error = 'Failed to load recordings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.recordings];
    
    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(recording => 
        recording.title.toLowerCase().includes(query) ||
        recording.description.toLowerCase().includes(query) ||
        recording.programName.toLowerCase().includes(query)
      );
    }
    
    // Program filter
    if (this.programFilter) {
      filtered = filtered.filter(recording => 
        recording.programId === this.programFilter
      );
    }
    
    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(recording => 
        this.statusFilter === 'active' ? recording.isActive : !recording.isActive
      );
    }
    
    this.filteredRecordings = filtered;
  }

  toggleRecordingStatus(recording: Recording): void {
    const confirmMsg = recording.isActive
      ? 'Are you sure you want to deactivate this recording?'
      : 'Are you sure you want to activate this recording?';
    
    if (confirm(confirmMsg)) {
      this.adminService.updateRecording(recording.id, { isActive: !recording.isActive }).subscribe({
        next: (updatedRecording) => {
          const index = this.recordings.findIndex(r => r.id === recording.id);
          if (index !== -1) {
            this.recordings[index] = updatedRecording;
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error toggling recording status:', error);
        }
      });
    }
  }

  deleteRecording(recording: Recording): void {
    if (confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      this.adminService.deleteRecording(recording.id).subscribe({
        next: () => {
          this.recordings = this.recordings.filter(r => r.id !== recording.id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting recording:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getYoutubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  getYoutubeUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}