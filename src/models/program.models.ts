export interface Program {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  startDate: string;
  description?: string;
  features?: string[];
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Stat {
  value: string;
  label: string;
  icon?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color?: string;
}

export interface Offering {
  icon: string;
  title: string;
  description: string;
  highlight: boolean;
  features?: string[];
}

export interface Testimonial {
  text: string;
  author: string;
  result: string;
  avatar?: string;
  rating?: number;
}

export interface TimelinePhase {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  stats?: { label: string; value: string }[];
  content: TimelineContent;
}

export interface TimelineContent {
  struggles?: TimelineStruggle[];
  milestones?: TimelineMilestone[];
  results?: TimelineResult[];
  insights?: string[];
}

export interface TimelineStruggle {
  icon: string;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}

export interface TimelineMilestone {
  week: string;
  focus: string;
  achievements: string[];
}

export interface TimelineResult {
  value: string;
  label: string;
  change: string;
  positive: boolean;
  highlight?: boolean;
}