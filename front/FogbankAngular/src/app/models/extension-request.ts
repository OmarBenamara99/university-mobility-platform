import { ExtensionStatus } from "./extension-status.enum";
import { User } from "./User";

export interface ExtensionRequest {
  id?: number;
  title: string;
  description: string;
  status?: ExtensionStatus;
  fileName?: string;
  filePath?: string;
  originalFileName?: string;
  submissionDate?: string;
  responseDate?: string;
  adminResponse?: string;
  studentId?: number;
  student?: User;
}