export interface UserProfile {
  id: string;
  userId: string;
  gender?: string;
  dateOfBirth?: Date;
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