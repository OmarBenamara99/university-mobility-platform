import { StatutCandidature } from "./statut-candidature.enum";

export interface ScoreUpdateDto {
  id: number;
  score: number;
  statut: StatutCandidature;
}