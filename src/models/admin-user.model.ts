export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  whatsAppNumber?: string;
  role: string; // From API: 'admin' or 'user'
  isActive: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  activeMemberships?: number;
  totalSpent?: number;
  // Add other fields from your API response
  dateOfBirth?: string | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  yogaExperienceLevel?: string | null;
  totalMemberships?: number;
  
  // Computed properties for frontend
  isAdmin?: boolean; // We'll compute this from role
  fullName?: string;
}
export interface AdminUserDetails {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  whatsAppNumber?: string;
  isAdmin: boolean;
  isActive: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  profile?: UserProfile;
  memberships?: Membership[];
  recentJournals?: Journal[];
}

export interface UserProfile {
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  yogaExperienceLevel?: string;
  healthGoals?: string;
}

export interface Membership {
  id: string;
  programName: string;
  status: string;
  startDate: string;
  endDate: string;
  whatsAppJoined: boolean;
  daysRemaining: number;
}

export interface Journal {
  id: string;
  title: string;
  entryDate: string;
  createdAt: string;
}

export interface PaginatedUsersResponse {
  users: AdminUser[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}