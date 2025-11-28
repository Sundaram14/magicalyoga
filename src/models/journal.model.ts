export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  entryDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalRequest {
  title: string;
  content: string;
  entryDate?: string;
}

export interface UpdateJournalRequest {
  title: string;
  content: string;
  entryDate?: string;
}