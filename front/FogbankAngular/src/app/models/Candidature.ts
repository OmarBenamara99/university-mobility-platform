import { AnneeEtude } from "./annee-etude.enum";
import { LangueStatus } from "./langue-status.enum";
import { Offre } from "./offre";
import { OptionEtude } from "./option-etude.enum";
import { StatutCandidature } from "./statut-candidature.enum";
import { User } from "./User";

export interface Candidature {
  id?: number;
  dateDepot: Date; // ISO format: yyyy-mm-dd
  statut: StatutCandidature;

  nom: string;
  prenom: string;
  idEsprit: string;
  phone: string;
  email: string;
  emailesprit: string;
  emailpersonel: string;

  CV: string;
  lettreMotivation: string;
  autreDocs: string;

  anneeActuelle: AnneeEtude;
  optionActuelle: OptionEtude;
  creditsNonValides: boolean;
  niveauLangue: LangueStatus;

  moyenne1A: number;
  moyenne2A: number;
  moyenne3A: number;
  moyenne4A: number;
  moyenne5A: number;

  offre: Offre;
  user: User;

  cvData?: any;  // or use ArrayBuffer if preferred
  lettreMotivationData?: any;
  autreDocsData?: any;

  score?: number; // Add this line
}