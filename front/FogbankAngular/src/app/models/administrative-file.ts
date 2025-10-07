import { Candidature } from "./Candidature";
import { FileStatus } from "./file-status.enum";
import { PaymentMethod } from "./payment-method.enum";

export interface AdministrativeFile {
  id?: number;
  createdAt: Date;
  lastUpdated: Date;
  paymentMethod?: PaymentMethod;
  status: FileStatus;
  
  paymentReceiptFilename?: string;
  paymentReceiptData?: any;
  
  chequesFilename?: string;
  chequesData?: any;
  
  candidature: Candidature;
}