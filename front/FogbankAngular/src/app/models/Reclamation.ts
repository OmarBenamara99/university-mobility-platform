export interface Reclamation {
  id?: number;
  subject: string;
  description: string;
  submissionDate?: string;
  adminResponse?: string;
  responseDate?: string;
  resolved?: boolean;
  studentId?: number;
  student?: any; // User object
}