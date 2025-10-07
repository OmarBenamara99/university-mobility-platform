import { Component,OnInit } from '@angular/core';
import { CandidatureService } from '../service/candidature.service';
import { AuthServiceService } from '../service/user/auth-service.service';
import { Candidature } from '../models/Candidature';
import { Offre } from '../models/offre';
import { OffreService } from '../service/offre.service';
import { AnneeEtude } from '../models/annee-etude.enum';
import { LangueStatus } from '../models/langue-status.enum';
import { OptionEtude } from '../models/option-etude.enum';


@Component({
  selector: 'app-studentcandidaturestat',
  templateUrl: './studentcandidaturestat.component.html',
  styleUrls: ['./studentcandidaturestat.component.css']
})
export class StudentcandidaturestatComponent implements OnInit {

  userCandidatures: Candidature[] = [];
  userOffresWithCandidatures: Offre[] = [];
  selectedCandidature: Candidature | null = null;
  modeFormulaire: 'affichage' | 'ajout' | 'modification' = 'affichage';

  private originalOffre: any | undefined;
  private originalUser: any | undefined;

  // enum lists for selects (used in the form)
  anneeEtudeValues = Object.values(AnneeEtude);
  optionEtudeValues = Object.values(OptionEtude);
  langueStatusValues = Object.values(LangueStatus);


  constructor(private candidatureService: CandidatureService, private offreService: OffreService, private authService : AuthServiceService) {}

  ngOnInit(): void {
  const user = this.authService.getCurrentUser();
  if (user && user.id) {
    this.loadUserCandidaturesGroupedByOffer(user.id);
  }
}

loadUserCandidaturesGroupedByOffer(userId: number): void {
  this.offreService.getOffresWithUserCandidatures(userId).subscribe({
    next: (data) => this.userOffresWithCandidatures = data,
    error: (err) => console.error('Erreur chargement candidatures:', err)
  });
}



  editCandidature(c: Candidature): void {
    this.selectedCandidature = { ...c}; // clone pour ne pas modifier directement dans la liste
    this.modeFormulaire = 'modification';
  }

  annuler(): void {
    this.modeFormulaire = 'affichage';
    this.selectedCandidature = {} as Candidature;
  }


  deleteCandidature(id?: number): void {
    if (!id) return;

    if (confirm("Voulez-vous vraiment supprimer cette candidature ?")) {
      this.candidatureService.delete(id).subscribe({
        next: () => {
          this.userCandidatures = this.userCandidatures.filter(c => c.id !== id);
          console.log("Candidature supprimée avec succès");
        },
        error: (err) => console.error("Erreur lors de la suppression :", err)
      });
    }
  }


  updateCandidature(): void {
  if (!this.selectedCandidature) return;

  this.candidatureService.update(this.selectedCandidature).subscribe({
    next: () => {
      const user = this.authService.getCurrentUser();
  if (user && user.id) {
    this.loadUserCandidaturesGroupedByOffer(user.id);
    }  
      this.selectedCandidature = null;
      this.modeFormulaire = 'affichage';
    },
    error: (err) => console.error("Erreur lors de la mise à jour de la candidature :", err)
  });
}




}
