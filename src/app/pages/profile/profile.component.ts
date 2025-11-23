import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ProfileResponse, UpdateProfileRequest } from '../../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm: FormGroup;
  profileData: ProfileResponse | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    // Initialize the form in constructor
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [''],
      whatsAppNumber: [''],
      gender: [''],
      dateOfBirth: [''],
      height: ['', [Validators.min(100), Validators.max(250)]],
      weight: ['', [Validators.min(30), Validators.max(200)]],
      medicalConditions: [''],
      ongoingMedications: [''],
      yogaExperienceLevel: [''],
      healthGoals: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  // Remove initializeForm() method since we're doing it in constructor

  private loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (response) => {
        this.profileData = response;
        this.populateForm(response);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private populateForm(profile: ProfileResponse): void {
    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      whatsAppNumber: profile.whatsAppNumber,
      gender: profile.profile?.gender || '',
      dateOfBirth: profile.profile?.dateOfBirth ? 
        new Date(profile.profile.dateOfBirth).toISOString().split('T')[0] : '',
      height: profile.profile?.height || '',
      weight: profile.profile?.weight || '',
      medicalConditions: profile.profile?.medicalConditions || '',
      ongoingMedications: profile.profile?.ongoingMedications || '',
      yogaExperienceLevel: profile.profile?.yogaExperienceLevel || '',
      healthGoals: profile.profile?.healthGoals || ''
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.profileForm.getRawValue();
      const updateData: UpdateProfileRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        gender: formValue.gender || undefined,
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
        height: formValue.height ? Number(formValue.height) : undefined,
        weight: formValue.weight ? Number(formValue.weight) : undefined,
        medicalConditions: formValue.medicalConditions || undefined,
        ongoingMedications: formValue.ongoingMedications || undefined,
        yogaExperienceLevel: formValue.yogaExperienceLevel || undefined,
        healthGoals: formValue.healthGoals || undefined
      };

      this.userService.updateProfile(updateData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.successMessage = 'Profile updated successfully!';
          this.loadProfile();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        }
      });
    }
  }

  canCompleteProfile(): boolean {
    const formValue = this.profileForm.getRawValue();
    return !!formValue.gender && !!formValue.height && !!formValue.weight;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}