import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ProfileResponse, UpdateProfileRequest } from '../../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileForm!: FormGroup;
  profileData: ProfileResponse | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  originalFormData: any = null;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfileData();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      // Basic Information - Keep required for data integrity
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }],
      whatsAppNumber: [{ value: '', disabled: true }],
      
      // Yoga Profile - Make optional for updates
      gender: [''],
      dateOfBirth: [''],
      height: [''],
      weight: [''],
      yogaExperienceLevel: [''],
      medicalConditions: [''],
      ongoingMedications: [''],
      healthGoals: ['']
    });
  }

  private loadProfileData(): void {
    this.userService.getProfile().subscribe({
      next: (response: ProfileResponse) => {
        this.profileData = response;
        this.populateForm(response);
        this.isLoading = false;
        
        // Store original data for change detection
        this.originalFormData = this.profileForm.getRawValue();
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile data. Please try again.';
        this.isLoading = false;
      }
    });
  }

 private populateForm(profileData: ProfileResponse): void {
  const formData = {
    firstName: profileData.firstName || '',
    lastName: profileData.lastName || '',
    email: profileData.email || '',
    whatsAppNumber: profileData.whatsAppNumber || '',
    gender: profileData.profile?.gender || '',
    dateOfBirth: this.formatDateForInput(profileData.profile?.dateOfBirth),
    height: profileData.profile?.height || '',
    weight: profileData.profile?.weight || '',
    yogaExperienceLevel: profileData.profile?.yogaExperienceLevel || '',
    medicalConditions: profileData.profile?.medicalConditions || '',
    ongoingMedications: profileData.profile?.ongoingMedications || '',
    healthGoals: profileData.profile?.healthGoals || ''
  };

  this.profileForm.patchValue(formData);
  
  // Store original data AFTER the form is populated
  setTimeout(() => {
    this.originalFormData = this.profileForm.getRawValue();
  });
}

  private formatDateForInput(date: any): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  // Check if form has any changes
hasFormChanges(): boolean {
  if (!this.profileData) return false;
  
  const currentData = this.profileForm.getRawValue();
  
  // Compare with actual profile data instead of originalFormData
  if (currentData.firstName !== this.profileData.firstName) return true;
  if (currentData.lastName !== this.profileData.lastName) return true;
  if (currentData.gender !== (this.profileData.profile?.gender || '')) return true;
  
  // Handle date comparison properly
  const currentDate = currentData.dateOfBirth;
  const profileDate = this.formatDateForInput(this.profileData.profile?.dateOfBirth);
  if (currentDate !== profileDate) return true;
  
  // Handle number comparisons
  if (this.compareNumbers(currentData.height, this.profileData.profile?.height)) return true;
  if (this.compareNumbers(currentData.weight, this.profileData.profile?.weight)) return true;
  
  // Text field comparisons
  if (currentData.yogaExperienceLevel !== (this.profileData.profile?.yogaExperienceLevel || '')) return true;
  if (currentData.medicalConditions !== (this.profileData.profile?.medicalConditions || '')) return true;
  if (currentData.ongoingMedications !== (this.profileData.profile?.ongoingMedications || '')) return true;
  if (currentData.healthGoals !== (this.profileData.profile?.healthGoals || '')) return true;
  
  return false;
}

// Helper method to compare numbers (handles null/undefined and string/number conversions)
private compareNumbers(current: any, original: any): boolean {
  const currentNum = current ? Number(current) : null;
  const originalNum = original ? Number(original) : null;
  
  if (currentNum === null && originalNum === null) return false;
  if (currentNum === null || originalNum === null) return true;
  
  return currentNum !== originalNum;
}

  // Check if form is valid AND has changes
  canSaveChanges(): boolean {
    return this.profileForm.valid && this.hasFormChanges();
  }

  onSubmit(): void {
    if (!this.canSaveChanges()) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.profileForm.getRawValue();

    const updateData: UpdateProfileRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
      height: formValue.height ? Number(formValue.height) : undefined,
      weight: formValue.weight ? Number(formValue.weight) : undefined,
      yogaExperienceLevel: formValue.yogaExperienceLevel,
      medicalConditions: formValue.medicalConditions,
      ongoingMedications: formValue.ongoingMedications,
      healthGoals: formValue.healthGoals
    };

    this.userService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Update original data
        this.originalFormData = this.profileForm.getRawValue();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    });
  }

  onCompleteProfile(): void {
    if (!this.canCompleteProfile()) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.profileForm.getRawValue();

    const completeProfileData: UpdateProfileRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
      height: formValue.height ? Number(formValue.height) : undefined,
      weight: formValue.weight ? Number(formValue.weight) : undefined,
      yogaExperienceLevel: formValue.yogaExperienceLevel,
      medicalConditions: formValue.medicalConditions,
      ongoingMedications: formValue.ongoingMedications,
      healthGoals: formValue.healthGoals
    };

    this.userService.completeProfile(completeProfileData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Profile completed successfully! Welcome to Magical Yoga!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error completing profile:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to complete profile. Please try again.';
      }
    });
  }

  canCompleteProfile(): boolean {
    const requiredFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'yogaExperienceLevel'];
    return requiredFields.every(field => {
      const value = this.profileForm.get(field)?.value;
      return value && value.toString().trim().length > 0;
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}