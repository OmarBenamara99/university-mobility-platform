import { Component, OnInit } from '@angular/core';
import { OffreService } from '../service/offre.service';
import { Offre } from '../models/offre';
import { Candidature } from '../models/Candidature';
import { CandidatureService } from '../service/candidature.service';
import { AnneeEtude }  from '../models/annee-etude.enum';
import { OptionEtude } from '../models/option-etude.enum';
import { LangueStatus } from '../models/langue-status.enum';
import { StatutCandidature } from '../models/statut-candidature.enum';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-admincandidature',
  templateUrl: './admincandidature.component.html',
  styleUrls: ['./admincandidature.component.css']
})
export class AdmincandidatureComponent implements OnInit {

  offres: Offre[] = [];
  modeFormulaire: 'affichage' | 'ajout' | 'modification' = 'affichage';
  selectedCandidature: Candidature | null = null;


  public AnneeEtude = AnneeEtude;
  public OptionEtude = OptionEtude;
  public LangueStatus = LangueStatus;

  public anneeEtudeValues = Object.values(AnneeEtude);
  public optionEtudeValues = Object.values(OptionEtude);
  public langueStatusValues = Object.values(LangueStatus);




  constructor(private offreService: OffreService, private candidatureService: CandidatureService) {}



  ngOnInit(): void {
    this.loadOffresWithCandidatures();
  }



  loadOffresWithCandidatures(): void {
    this.offreService.getAllWithCandidatures().subscribe({
      next: (data) => this.offres = data,
      error: (err) => console.error('Erreur lors du chargement des offres avec candidatures:', err)
    });
  }


  ouvrirModificationCandidature(c: Candidature): void {
    this.selectedCandidature = { ...c}; // clone pour ne pas modifier directement dans la liste
    this.modeFormulaire = 'modification';
  }

  annuler(): void {
    this.modeFormulaire = 'affichage';
    this.selectedCandidature = {} as Candidature;
  }

  updateCandidature(): void {
  if (!this.selectedCandidature) return;

  this.candidatureService.update(this.selectedCandidature).subscribe({
    next: () => {
      this.loadOffresWithCandidatures();
      this.selectedCandidature = null;
      this.modeFormulaire = 'affichage';
    },
    error: (err) => console.error("Erreur lors de la mise à jour de la candidature :", err)
  });
}

supprimerCandidature(id: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
    this.candidatureService.delete(id).subscribe({
      next: () => {
        console.log('Candidature supprimée avec succès');
        this.loadOffresWithCandidatures(); // Refresh the table
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la candidature :', err);
      }
    });
  }}

 calculerScores(offre: Offre) {
  if (!offre.candidatures || offre.candidatures.length === 0) {
    console.warn('No candidatures to process');
    return;
  }

  // 1. Calculate base scores with penalties
  const scoredCandidatures = offre.candidatures.map(c => {
    // Base average
    let score = (c.moyenne1A + c.moyenne2A + c.moyenne3A + c.moyenne4A + c.moyenne5A) / 5;

    // Apply penalties
    if (c.creditsNonValides) {
      score -= 2; // Penalty for unvalidated credits
    }

    switch(c.niveauLangue) {
      case LangueStatus.MANQUE_FR:
      case LangueStatus.MANQUE_ANG:
        score -= 1;
        break;
      case LangueStatus.MANQUE_LES_DEUX:
        score -= 2;
        break;
      case LangueStatus.OK:
        // No penalty
        break;
    }

    return {
      ...c,
      calculatedScore: score // Temporary storage for sorting
    };
  });

  // 2. Sort by calculated score (descending)
  scoredCandidatures.sort((a, b) => b.calculatedScore - a.calculatedScore);

  // 3. Determine final status based on available places
  const updates = scoredCandidatures.map((c, index) => {
    const statut = index < offre.nombrePlaces && c.calculatedScore >= 12
      ? StatutCandidature.ACCEPTEE
      : StatutCandidature.REFUSEE;

    return {
      id: c.id!,
      score: c.calculatedScore,
      user: c.user,
      statut: statut
    };
  });


  // 4. Send to backend
  this.candidatureService.updateScores(updates).subscribe({
    next: () => {
      // Update frontend
      updates.forEach(update => {
  const cand = offre.candidatures?.find(c => c.id === update.id);
  if (cand) {
    cand.score = update.score;
    cand.statut = update.statut;
    const templateId = update.statut === StatutCandidature.ACCEPTEE 
      ? 'template_ias8qu6' 
      : 'template_fkd3low';

    // Send email
          emailjs.send(
  'service_akykcbg',
  templateId,
  {
    student_name: `${cand.prenom} ${cand.nom}`,
    status: update.statut === StatutCandidature.ACCEPTEE ? 'ACCEPTÉE' : 'NON RETENUE', // Send French text directly
    to_email: cand.email,
    offer_universite: offre.universite,
    offer_titre: offre.titre,
  },
            'bVBlyuFaKpr9O-aLo'
          ).then(
            () => console.log('Email sent to', cand.email),
            (err) => console.error('Email failed:', err)
          );
  }
});
    },
    error: (err) => console.error('Update failed:', err)
  });
}





}
