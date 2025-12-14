export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // We'll create this from firstName + lastName
  whatsAppNumber: string;
  role: string; // 'admin' or 'user'
  isActive: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
  activeMemberships?: number;
  totalSpent: number;
  isAdmin?: boolean; // From your API response
  
  // For user details
  profile?: UserProfile;
  memberships?: Membership[];
  recentJournals?: Journal[];
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  whatsAppNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  Role: string;
}

// models/profile.model.ts
export interface UserProfile {
  id: string;
  userId: string;
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  medicalConditions?: string;
  ongoingMedications?: string;
  yogaExperienceLevel?: string;
  healthGoals?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileResponse {
  id: string;
  whatsAppNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  isProfileCompleted: boolean;
  profile?: UserProfile;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  gender?: string;
  dateOfBirth?: Date;
  height?: number;
  weight?: number;
  medicalConditions?: string;
  ongoingMedications?: string;
  yogaExperienceLevel?: string;
  healthGoals?: string;
}