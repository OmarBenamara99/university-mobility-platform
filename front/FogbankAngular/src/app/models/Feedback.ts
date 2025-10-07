export interface Feedback {
  id?: number;
  submissionDate?: string;
  
  // Star ratings (1-5)
  qualityOfCourses: number;
  academicInfrastructure: number;
  accommodation: number;
  campusLife: number;
  culturalAdaptation: number;
  administrativeSupport: number;
  costOfLiving: number;
  locationAccessibility: number;
  globalSatisfaction: number;
  
  // Optional text feedback
  additionalComments?: string;
  
  // Relationships
  studentId?: number;
  offerId?: number;
}

// Feedback submission DTO
export interface FeedbackSubmission {
  qualityOfCourses: number;
  academicInfrastructure: number;
  accommodation: number;
  campusLife: number;
  culturalAdaptation: number;
  administrativeSupport: number;
  costOfLiving: number;
  locationAccessibility: number;
  globalSatisfaction: number;
  additionalComments?: string;
}