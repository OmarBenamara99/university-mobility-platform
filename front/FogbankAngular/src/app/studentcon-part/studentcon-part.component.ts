import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../service/user/auth-service.service';
import { OffreService } from '../service/offre.service';
import { StatutCandidature } from '../models/statut-candidature.enum';
import { Offre } from '../models/offre';
import { CandidatureService } from '../service/candidature.service';
import { AdministrativeFileServiceService } from '../service/administrative-file-service.service';

@Component({
  selector: 'app-studentcon-part',
  templateUrl: './studentcon-part.component.html',
  styleUrls: ['./studentcon-part.component.css']
})
export class StudentconPartComponent implements OnInit{

acceptedOffers: Offre[] = [];
  selectedOfferId: number | null = null;
  confirmed = false;
  loading = true;
    wantsToParticipate: boolean = true; // Track Oui/Non choice


  constructor(
    private authService: AuthServiceService,
    private offreService: OffreService,
    private candidatureService: CandidatureService,
    private administrativeFileService: AdministrativeFileServiceService
  ) {}

  ngOnInit(): void {
    this.loadAcceptedCandidatures();
  }

  loadAcceptedCandidatures(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
    console.log('No user found.');
    return;
  }
    

    this.loading = true;
    this.offreService.getOffresWithUserCandidatures(user.id).subscribe({
      next: (data: Offre[]) => {
        console.log('Offers from backend:', data);
        this.acceptedOffers = data.filter(offer => 
          offer.candidatures?.some(c => c.statut === StatutCandidature.ACCEPTEE)
        );
        console.log('Accepted offers:', this.acceptedOffers);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading candidatures:', err);
        this.loading = false;
      }
    });
  }


  onConfirmationSubmit(): void {
  const user = this.authService.getCurrentUser();
  if (!user?.id) {
    alert('Utilisateur non identifié');
    return;
  }

  if (!this.wantsToParticipate) {
    this.handleNoChoice(user.id);
  } else {
    this.handleYesChoice(user.id);
  }
}

private handleNoChoice(userId: number): void {
  this.candidatureService.deleteAllUserCandidatures(userId).subscribe({
    next: () => this.confirmed = true,
    error: (err) => alert('Erreur lors de la suppression')
  });
}

private handleYesChoice(userId: number): void {
  if (this.acceptedOffers.length > 1 && !this.selectedOfferId) {
    alert('Veuillez sélectionner une mobilité');
    return;
  }

  const candidatureId = this.findAcceptedCandidatureId(userId);
  if (!candidatureId) {
    alert('Aucune candidature valide trouvée');
    return;
  }

   this.candidatureService.confirmSingleCandidature(userId, candidatureId).subscribe({
    next: () => {
      // After successful confirmation, create the administrative file
      this.administrativeFileService.createForCandidature(candidatureId).subscribe({
        next: (adminFile) => {
          console.log('Administrative file created:', adminFile);
          this.confirmed = true;
          alert('Votre choix a été confirmé! Veuillez maintenant compléter la régularisation administrative.');
        },
        error: (err) => {
          console.error('Error creating admin file:', err);
          alert('Confirmation réussie mais erreur lors de la création du dossier administratif. Contactez l\'administration.');
          this.confirmed = true; // Still mark as confirmed since candidature was processed
        }
      });
    },
    error: (err) => alert('Erreur lors de la confirmation')
  });
}

private findAcceptedCandidatureId(userId: number): number | null {
  const targetOfferId = this.acceptedOffers.length === 1 
    ? this.acceptedOffers[0].id 
    : this.selectedOfferId;

  const offer = this.acceptedOffers.find(o => o.id === targetOfferId);
  return offer?.candidatures?.find(c => 
    c.statut === StatutCandidature.ACCEPTEE 
  )?.id || null;
}

}
