import { ChoiceType } from "./ChoiceType.enum";

export interface ExamChoice {
  id?: number;
  choice: ChoiceType;
  submissionDate?: string;
  studentId?: number;
  offerId?: number;
  student?: any;
  offer?: any;
}