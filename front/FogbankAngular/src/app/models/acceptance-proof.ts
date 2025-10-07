import { Candidature } from "./Candidature";
import { ProofStatus } from "./proof-status.enum";

export interface AcceptanceProof {
  id?: number;
  createdAt: Date;
  lastUpdated: Date;
  status: ProofStatus;
  
  documentFilename?: string;
  acceptanceDocumentData?: any;
  
  candidature: Candidature;
}