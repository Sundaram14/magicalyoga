import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService, Recording } from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-recording-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-recording-form.component.html',
  styleUrls: ['./admin-recording-form.component.css']
})
export class AdminRecordingFormComponent implements OnInit {
  isEditMode = false;
  recordingId: string | null = null;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  // Form data
  formData = {
    programId: '',
    title: '',
    description: '',
    youtubeVideoId: '',
    durationMinutes: 30,
    sequenceOrder: 1,
    isActive: true
  };
  
  // Programs list
  programs = [
    { id: '09a1c14a-ff26-4855-af76-2e52e05de0c0', name: 'Reset 42 - Transformational Program' }
  ];

  // Make router public instead of private
  constructor(
    private route: ActivatedRoute,
    public router: Router, // Changed from private to public
    private adminService: AdminService
  ) {}

    ngOnInit(): void {
    this.recordingId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recordingId;
    
    if (this.isEditMode && this.recordingId) {
      this.loadRecording();
    }
  }

  // Add this public method for navigation
  navigateToRecordings(): void {
    this.router.navigate(['/admin/recordings']);
  }

  loadRecording(): void {
    if (!this.recordingId) return;
    
    this.isLoading = true;
    this.adminService.getRecordings().subscribe({
      next: (recordings) => {
        const recording = recordings.find(r => r.id === this.recordingId);
        if (recording) {
          this.formData = {
            programId: recording.programId,
            title: recording.title,
            description: recording.description,
            youtubeVideoId: recording.youtubeVideoId,
            durationMinutes: recording.durationMinutes,
            sequenceOrder: recording.sequenceOrder,
            isActive: recording.isActive
          };
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recording:', error);
        this.error = 'Failed to load recording data.';
        this.isLoading = false;
      }
    });
  }

  extractYoutubeVideoId(url: string): string {
    if (!url) return '';
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/,
      /(?:youtube\.com\/embed\/)([^&\s?]+)/,
      /(?:youtube\.com\/v\/)([^&\s?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // If no pattern matches, return as-is (might already be a video ID)
    return url.trim();
  }

  validateForm(): boolean {
    this.error = null;
    
    if (!this.formData.programId) {
      this.error = 'Please select a program.';
      return false;
    }
    
    if (!this.formData.title.trim()) {
      this.error = 'Please enter a title.';
      return false;
    }
    
    if (!this.formData.youtubeVideoId.trim()) {
      this.error = 'Please enter a YouTube video ID or URL.';
      return false;
    }
    
    // Extract video ID if URL was provided
    if (this.formData.youtubeVideoId.includes('youtube.com') || this.formData.youtubeVideoId.includes('youtu.be')) {
      this.formData.youtubeVideoId = this.extractYoutubeVideoId(this.formData.youtubeVideoId);
    }
    
    if (this.formData.durationMinutes <= 0) {
      this.error = 'Duration must be greater than 0.';
      return false;
    }
    
    if (this.formData.sequenceOrder <= 0) {
      this.error = 'Sequence order must be greater than 0.';
      return false;
    }
    
    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;
    
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    const submissionData = { ...this.formData };
    
    if (this.isEditMode && this.recordingId) {
      // Update existing recording
      this.adminService.updateRecording(this.recordingId, submissionData).subscribe({
        next: () => {
          this.successMessage = 'Recording updated successfully!';
          this.isLoading = false;
          setTimeout(() => this.navigateToRecordings(), 2000); // Use the method
        },
        error: (error) => {
          console.error('Error updating recording:', error);
          this.error = error.message || 'Failed to update recording. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      // Create new recording
      this.adminService.createRecording(submissionData).subscribe({
        next: () => {
          this.successMessage = 'Recording created successfully!';
          this.isLoading = false;
          setTimeout(() => this.navigateToRecordings(), 2000); // Use the method
        },
        error: (error) => {
          console.error('Error creating recording:', error);
          this.error = error.message || 'Failed to create recording. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  getYoutubeEmbedUrl(): string {
    if (!this.formData.youtubeVideoId) return '';
    const videoId = this.extractYoutubeVideoId(this.formData.youtubeVideoId);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  getYoutubeThumbnail(): string {
    if (!this.formData.youtubeVideoId) return '';
    const videoId = this.extractYoutubeVideoId(this.formData.youtubeVideoId);
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
}