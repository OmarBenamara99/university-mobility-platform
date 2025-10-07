import { Component, OnInit } from '@angular/core';
import { ChoiceType } from '../models/ChoiceType.enum';
import { EquivalenceDocument } from '../models/EquivalenceDocument';
import { ExamChoice } from '../models/ExamChoice';
import { Offre } from '../models/offre';
import { EquivalenceService } from '../service/equivalence.service';
import { OffreService } from '../service/offre.service';
import { AuthServiceService } from '../service/user/auth-service.service';

@Component({
  selector: 'app-studenteq',
  templateUrl: './studenteq.component.html',
  styleUrls: ['./studenteq.component.css']
})
export class StudenteqComponent implements OnInit {

acceptedOffers: Offre[] = [];
  selectedOfferId: number | null = null;
  examChoice: ChoiceType = ChoiceType.ESPRIT;
  documents: EquivalenceDocument[] = [];
  loading: boolean = false;
  submitted: boolean = false;
  studentId: number;
  ChoiceType = ChoiceType;

  constructor(
    private offreService: OffreService,
    private equivalenceService: EquivalenceService,
    private authService: AuthServiceService
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.studentId = currentUser?.id;
  }

  ngOnInit(): void {
    this.loadAcceptedOffers();
  }

  loadAcceptedOffers(): void {
    this.loading = true;
    this.offreService.getOffresWithUserCandidatures(this.studentId).subscribe({
      next: (offers) => {
        this.acceptedOffers = offers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading accepted offers:', error);
        this.loading = false;
      }
    });
  }

  onOfferSelect(): void {
    if (this.selectedOfferId) {
      this.loadDocumentsForOffer(this.selectedOfferId);
    }
  }

  loadDocumentsForOffer(offerId: number): void {
    this.equivalenceService.getDocumentsByOffer(offerId).subscribe({
      next: (documents) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  downloadDocument(doc: EquivalenceDocument): void {
  this.equivalenceService.downloadDocument(doc.id!).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = doc.originalFileName;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Error downloading document:', error);
      alert('Erreur lors du téléchargement du document');
    }
  });
}

  onSubmit(): void {
    if (!this.selectedOfferId) {
      alert('Veuillez sélectionner une offre');
      return;
    }

    this.loading = true;
    
    const examChoice: ExamChoice = {
      choice: this.examChoice,
      studentId: this.studentId,
      offerId: this.selectedOfferId
    };

    this.equivalenceService.submitExamChoice(examChoice, this.studentId, this.selectedOfferId).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitted = true;
      },
      error: (error) => {
        console.error('Error submitting exam choice:', error);
        this.loading = false;
        alert('Erreur lors de la soumission de votre choix');
      }
    });
  }

  getChoiceText(choice: ChoiceType): string {
    const choices = {
      [ChoiceType.ESPRIT]: 'Passer les examens à ESPRIT',
      [ChoiceType.PARTNER_UNIVERSITY]: 'Passer les examens à l\'université partenaire',
      [ChoiceType.COMBINATION]: 'Combinaison des deux'
    };
    return choices[choice];
  }
}
