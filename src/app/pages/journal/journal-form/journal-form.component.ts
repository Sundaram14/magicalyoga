import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../../../../services/journal.service';
import { JournalEntry, CreateJournalRequest, UpdateJournalRequest } from '../../../../models/journal.model';

@Component({
  selector: 'app-journal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.css']
})
export class JournalFormComponent implements OnInit {
  private journalService = inject(JournalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  journalForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  journalId: string | null = null;
  journalEntry: JournalEntry | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.journalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required]],
      entryDate: [new Date().toISOString().split('T')[0], [Validators.required]]
    });
  }

  private checkEditMode(): void {
    this.journalId = this.route.snapshot.paramMap.get('id');
    if (this.journalId) {
      this.isEditMode = true;
      this.loadJournalEntry();
    }
  }

  private loadJournalEntry(): void {
    if (!this.journalId) return;

    this.isLoading = true;
    this.journalService.getEntry(this.journalId).subscribe({
      next: (entry) => {
        this.journalEntry = entry;
        this.populateForm(entry);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load journal entry';
        this.isLoading = false;
        console.error('Error loading journal entry:', error);
      }
    });
  }

  private populateForm(entry: JournalEntry): void {
    this.journalForm.patchValue({
      title: entry.title,
      content: entry.content,
      entryDate: new Date(entry.entryDate).toISOString().split('T')[0]
    });
  }

  onSubmit(): void {
    if (this.journalForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.journalForm.value;

    if (this.isEditMode && this.journalId) {
      this.updateEntry(formValue);
    } else {
      this.createEntry(formValue);
    }
  }

  private createEntry(formData: any): void {
    const createRequest: CreateJournalRequest = {
      title: formData.title,
      content: formData.content,
      entryDate: formData.entryDate
    };

    this.journalService.createEntry(createRequest).subscribe({
      next: (entry) => {
        this.isSubmitting = false;
        this.router.navigate(['/journal']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create journal entry';
        console.error('Error creating entry:', error);
      }
    });
  }

  private updateEntry(formData: any): void {
    if (!this.journalId) return;

    const updateRequest: UpdateJournalRequest = {
      title: formData.title,
      content: formData.content,
      entryDate: formData.entryDate
    };

    this.journalService.updateEntry(this.journalId, updateRequest).subscribe({
      next: (entry) => {
        this.isSubmitting = false;
        this.router.navigate(['/journal']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to update journal entry';
        console.error('Error updating entry:', error);
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.journalForm.controls).forEach(key => {
      const control = this.journalForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/journal']);
  }

  get title() { return this.journalForm.get('title'); }
  get content() { return this.journalForm.get('content'); }
  get entryDate() { return this.journalForm.get('entryDate'); }
}