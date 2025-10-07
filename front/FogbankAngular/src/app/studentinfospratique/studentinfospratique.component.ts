import { Component } from '@angular/core';
import { Offre } from '../models/offre';
import { OffreService } from '../service/offre.service';
import { AuthServiceService } from '../service/user/auth-service.service';

@Component({
  selector: 'app-studentinfospratique',
  templateUrl: './studentinfospratique.component.html',
  styleUrls: ['./studentinfospratique.component.css']
})
export class StudentinfospratiqueComponent {

currentUser: any;
  userOffer: Offre | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private offreService: OffreService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.id) {
      this.loadUserOffer();
    } else {
      this.loading = false;
      this.error = 'Utilisateur non connecté';
    }
  }

  loadUserOffer() {
    this.offreService.getOffresWithUserCandidatures(this.currentUser.id).subscribe({
      next: (offres) => {
        if (offres && offres.length > 0) {
          // Since user has only one accepted candidature, take the first offer
          this.userOffer = offres[0];
        } else {
          this.error = 'Aucune offre trouvée pour cet utilisateur';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user offer:', err);
        this.error = 'Erreur lors du chargement des informations';
        this.loading = false;
      }
    });
  }
}
