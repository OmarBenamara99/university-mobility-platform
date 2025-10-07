import { Offre } from "./offre";

export interface EquivalenceDocument {
  id?: number;
  fileName: string;
  filePath: string;
  originalFileName: string;
  uploadDate?: string;
  offerId?: number;
  studentId?: number;
  type?: string; // 'ADMIN_EQUIVALENCE_GRID' or 'STUDENT_GRADE_TRANSCRIPT'
  student?: any;
    offer?: Offre; // Add this line

}