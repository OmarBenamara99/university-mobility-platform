import { Component, OnInit } from '@angular/core';
import { Offre } from '../models/offre';
import { OrdreMission } from '../models/OrdreMission';
import { OffreService } from '../service/offre.service';
import { OrdreMissionService } from '../service/ordre-mission.service';
import { AuthServiceService } from '../service/user/auth-service.service';

@Component({
  selector: 'app-studentordremis',
  templateUrl: './studentordremis.component.html',
  styleUrls: ['./studentordremis.component.css']
})
export class StudentordremisComponent implements OnInit{

  currentUser: any;
  userOffer: Offre | null = null;
  ordreMission: OrdreMission | null = null;
  loading = true;
  error: string | null = null;
  downloadInProgress = false;

  constructor(
    private authService: AuthServiceService,
    private offreService: OffreService,
    private ordreMissionService: OrdreMissionService
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

  loadUserOffer(): void {
    this.offreService.getOffresWithUserCandidatures(this.currentUser.id).subscribe({
      next: (offres) => {
        if (offres && offres.length > 0) {
          this.userOffer = offres[0];
          this.loadOrdreMission();
        } else {
          this.error = 'Aucune offre trouvée pour votre compte';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading user offer:', err);
        this.error = 'Erreur lors du chargement de votre offre';
        this.loading = false;
      }
    });
  }

  loadOrdreMission(): void {
    if (this.userOffer?.id) {
      this.ordreMissionService.getOrdreMissionByOfferId(this.userOffer.id).subscribe({
        next: (ordreMission) => {
          this.ordreMission = ordreMission;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading ordre mission:', err);
          if (err.status === 404) {
            this.error = 'Aucun Ordre de Mission disponible pour votre offre';
          } else {
            this.error = 'Erreur lors du chargement de l\'Ordre de Mission';
          }
          this.loading = false;
        }
      });
    }
  }

  downloadOrdreMission(): void {
    if (!this.userOffer?.id) return;

    this.downloadInProgress = true;
    this.ordreMissionService.downloadOrdreMission(this.userOffer.id).subscribe({
      next: (blob) => {
        this.downloadInProgress = false;
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.ordreMission?.originalFileName || 'ordre_mission.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading ordre mission:', err);
        this.downloadInProgress = false;
        this.error = 'Erreur lors du téléchargement du fichier';
      }
    });
  }

  refresh(): void {
    this.loading = true;
    this.error = null;
    this.loadUserOffer();
  }

}
