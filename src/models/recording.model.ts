export interface Recording {
  id: string;
  programId: string;
  programName?: string; // controller sets this
  title: string;
  description?: string | null;
  // API may send YouTubeVideoId or youTubeVideoId depending on serializer;
  // We'll use youtubeVideoId in the Angular model.
  youtubeVideoId: string;
  durationMinutes?: number | null;
  sequenceOrder: number;
  isActive?: boolean;
}