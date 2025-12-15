import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JournalService } from '../../../../services/journal.service';
import { JournalEntry } from '../../../../models/journal.model';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.css']
})
export class JournalListComponent implements OnInit {
  private journalService = inject(JournalService);

  entries: JournalEntry[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.isLoading = true;
    this.journalService.getUserEntries().subscribe({
      next: (entries) => {
        this.entries = entries;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load journal entries';
        this.isLoading = false;
        console.error('Error loading entries:', error);
      }
    });
  }

  deleteEntry(id: string): void {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      this.journalService.deleteEntry(id).subscribe({
        next: () => {
          this.entries = this.entries.filter(entry => entry.id !== id);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete journal entry';
          console.error('Error deleting entry:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}