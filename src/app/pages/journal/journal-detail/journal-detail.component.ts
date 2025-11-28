import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../../../../services/journal.service';
import { JournalEntry } from '../../../../models/journal.model';

@Component({
  selector: 'app-journal-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.css']
})
export class JournalDetailComponent implements OnInit {
  private journalService = inject(JournalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  journalEntry: JournalEntry | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadJournalEntry();
  }

  private loadJournalEntry(): void {
    const journalId = this.route.snapshot.paramMap.get('id');
    if (!journalId) {
      this.errorMessage = 'Journal entry not found';
      this.isLoading = false;
      return;
    }

    this.journalService.getEntry(journalId).subscribe({
      next: (entry) => {
        this.journalEntry = entry;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load journal entry';
        this.isLoading = false;
        console.error('Error loading journal entry:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  onEdit(): void {
    if (this.journalEntry) {
      this.router.navigate(['/journal/edit', this.journalEntry.id]);
    }
  }

  onDelete(): void {
    if (!this.journalEntry) return;

    if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      this.journalService.deleteEntry(this.journalEntry.id).subscribe({
        next: () => {
          this.router.navigate(['/journal']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete journal entry';
          console.error('Error deleting entry:', error);
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/journal']);
  }
}