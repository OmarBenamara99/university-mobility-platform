import { Component } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { Offre } from '../models/offre';
import { OffreService } from '../service/offre.service';
import { Candidature } from '../models/Candidature';
import { AnneeEtude } from '../models/annee-etude.enum';
import { OptionEtude } from '../models/option-etude.enum';
import { LangueStatus } from '../models/langue-status.enum';
import { CandidatureService } from '../service/candidature.service';
import { AuthServiceService } from '../service/user/auth-service.service';

@Component({
  selector: 'app-studentcandidature',
  templateUrl: './studentcandidature.component.html',
  styleUrls: ['./studentcandidature.component.css'],
  styles: [`
    fieldset {
      display: none;
      width: 100%;
      border: none;
      padding: 0;
      margin: 0;
    }

    fieldset.active-step {
      display: block;
    }
  `]
})
export class StudentcandidatureComponent {

  offres: Offre[] = [];
  selectedOffre: Offre | null = null;
  currentStep: number = 0;
  selectedOffree!: Offre;
  cvFile?: File;
  lettreMotivationFile?: File;
  autreDocsFile?: File;

  candidature: Candidature = {
  statut: 'EN_ATTENTE',
  dateDepot: new Date(2024, 3, 25),

  nom: '',
  prenom: '',
  idEsprit: '',
  phone: '',
  email: '',
  emailesprit: '',
  emailpersonel: '',

  CV: '',
  lettreMotivation: '',
  autreDocs: '',

  anneeActuelle: undefined as any,
  optionActuelle: undefined as any,
  creditsNonValides: false,
  niveauLangue: undefined as any,

  moyenne1A: 0,
  moyenne2A: 0,
  moyenne3A: 0,
  moyenne4A: 0,
  moyenne5A: 0,

  user: undefined as any,
  offre: undefined as any
  
} as Candidature;

AnneeEtude = Object.values(AnneeEtude);
OptionEtude = Object.values(OptionEtude);
LangueStatus = Object.values(LangueStatus);


    constructor(private offreService: OffreService, private lightbox: Lightbox, private candidatureService:CandidatureService, private authService : AuthServiceService) {}
  
    ngOnInit(): void {
      this.offreService.getAll().subscribe({
        next: (data) => this.offres = data,
        error: (err) => console.error('Erreur chargement offres:', err)
      });

       // Affiche le premier step au démarrage
  setTimeout(() => {
    const steps = document.querySelectorAll("fieldset");
    if (steps.length > 0) {
      steps[0].classList.add("active-step");
    }
  });
    }
  
    openLightbox(offre: any): void {
    if (!offre.imageUrls || !offre.imageUrls.length) {
      console.warn('Aucune image trouvée');
      return;
    }
  
    const album = offre.imageUrls.map((url: string) => ({
      src: url,
      caption: offre.titre || '',
      thumb: url
    }));
  
    console.log('Album lightbox:', album); // 🔍 pour vérifier que tu as plusieurs images
  
    this.lightbox.open(album, 0); // ouvre à partir de la première image
  }
  
  openLightboxTest() {
    const album = [
      { src: 'assets/img/china.jpg', caption: 'china', thumb: 'assets/img/china.jpg' },
      { src: 'assets/img/tunisia.jpg', caption: 'tunisia', thumb: 'assets/img/tunisia.jpg' }
    ];
    this.lightbox.open(album, 0);
  }

  startCandidature(offre: Offre): void {
  this.selectedOffre = offre;
  this.selectedOffree = offre;
}

nextStep(): void {
  const steps = document.querySelectorAll("fieldset");
  if (this.currentStep < steps.length - 1) {
    steps[this.currentStep].classList.remove("active-step");
    this.currentStep++;
    steps[this.currentStep].classList.add("active-step");
  }
}

previousStep(): void {
  const steps = document.querySelectorAll("fieldset");
  if (this.currentStep > 0) {
    steps[this.currentStep].classList.remove("active-step");
    this.currentStep--;
    steps[this.currentStep].classList.add("active-step");
  }
}

// Add this method
onFileSelected(event: Event, fileType: 'cv' | 'lettreMotivation' | 'autreDocs') {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    switch(fileType) {
      case 'cv': 
        this.cvFile = file;
        this.candidature.CV = file.name;
        break;
      case 'lettreMotivation': 
        this.lettreMotivationFile = file;
        this.candidature.lettreMotivation = file.name;
        break;
      case 'autreDocs': 
        this.autreDocsFile = file;
        this.candidature.autreDocs = file.name;
        break;
    }
  }
}

submitCandidature(): void {
  this.candidature.user = this.authService.getCurrentUser();
  this.candidature.offre = this.selectedOffree;
  this.candidature.dateDepot = new Date();
  
  this.candidatureService.create(this.candidature).subscribe({
    next: (createdCandidature) => {
      // Upload files after creating candidature
      if (this.cvFile) {
        this.candidatureService.uploadFiles(
          createdCandidature.id!,
          this.cvFile,
          this.lettreMotivationFile,
          this.autreDocsFile
        ).subscribe({
          next: () => {
            alert("Votre candidature a été soumise avec succès.");
          },
          error: (err) => {
            console.error("Erreur lors de l'upload des fichiers:", err);
          }
        });
      } else {
        alert("Votre candidature a été soumise sans CV.");
      }
    },
    error: (err) => {
      console.error("Erreur lors de la soumission :", err);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  });
}



}
