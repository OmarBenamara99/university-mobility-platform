import { Component, OnInit } from '@angular/core';
import { Feedback, FeedbackSubmission } from '../models/Feedback';
import { Offre } from '../models/offre';
import { FeedbackService } from '../service/feedback.service';
import { OffreService } from '../service/offre.service';
import { AuthServiceService } from '../service/user/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-studentfeedback',
  templateUrl: './studentfeedback.component.html',
  styleUrls: ['./studentfeedback.component.css']
})
export class StudentfeedbackComponent implements OnInit {

  feedback: FeedbackSubmission = {
    qualityOfCourses: 0,
    academicInfrastructure: 0,
    accommodation: 0,
    campusLife: 0,
    culturalAdaptation: 0,
    administrativeSupport: 0,
    costOfLiving: 0,
    locationAccessibility: 0,
    globalSatisfaction: 0,
    additionalComments: ''
  };

  offers: Offre[] = [];
  selectedOfferId: number | null = null;
  currentOffer: Offre | null = null;
  studentId: number = 0;
  hasAlreadySubmitted: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  existingFeedback: Feedback | null = null;

  ratingCategories = [
  {key: 'qualityOfCourses', label: 'Qualité des Cours (Contenu, méthodes, disponibilité professeurs)'},
  {key: 'academicInfrastructure', label: 'Infrastructure Académique (Bibliothèque, laboratoires, équipements IT)'},
  {key: 'accommodation', label: 'Logement (Qualité, proximité, sécurité, rapport qualité-prix)'},
  {key: 'campusLife', label: 'Vie sur le Campus (Associations, activités culturelles, sports)'},
  {key: 'culturalAdaptation', label: 'Adaptation Culturelle (Barrière linguistique, activités culturelles, intégration)'},
  {key: 'administrativeSupport', label: 'Support Administratif (Visa, inscription, guidance, résolution problèmes)'},
  {key: 'costOfLiving', label: 'Coût de la Vie (Logement, nourriture, transport, adéquation budget)'},
  {key: 'locationAccessibility', label: 'Localisation & Accessibilité (Transport public, proximité centre-ville, sécurité)'},
  {key: 'globalSatisfaction', label: 'Satisfaction Globale (Expérience générale, recommandation, développement personnel)'}
];

  constructor(
    private feedbackService: FeedbackService,
    private offreService: OffreService,
    private authService: AuthServiceService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.studentId = user?.id ?? 0;
  }

  ngOnInit(): void {
    this.loadStudentOffers();
  }

  loadStudentOffers(): void {
    this.offreService.getOffresWithUserCandidatures(this.studentId).subscribe({
      next: (offers) => {
        this.offers = offers;
        if (offers.length > 0) {
          this.selectedOfferId = offers[0].id ?? null;
          this.currentOffer = offers[0];
          this.checkIfFeedbackSubmitted();
        }
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        this.showMessage('Error loading your mobility programs', 'error');
      }
    });
  }

  onOfferSelect(offerId: number): void {
    this.selectedOfferId = +offerId;
    this.currentOffer = this.offers.find(o => o.id === this.selectedOfferId) ?? null;
    this.existingFeedback = null;
    this.hasAlreadySubmitted = false;
    if (this.currentOffer) {
      this.checkIfFeedbackSubmitted();
    }
  }

  checkIfFeedbackSubmitted(): void {
    if (!this.currentOffer) return;
    this.feedbackService.hasSubmittedFeedback(this.studentId, this.currentOffer.id!).subscribe({
      next: (hasSubmitted) => {
        this.hasAlreadySubmitted = hasSubmitted;
        if (hasSubmitted) {
          this.feedbackService.getStudentFeedback(this.studentId, this.currentOffer?.id ?? 0).subscribe({
            next: (fb) => {
              this.existingFeedback = fb;
              // Fill feedback fields for display
              Object.keys(this.feedback).forEach(key => {
  if ((fb as any)[key] !== undefined) (this.feedback as any)[key] = (fb as any)[key];
});
              this.feedback.additionalComments = fb.additionalComments ?? '';
            }
          });
        } else {
          // Reset feedback fields
          Object.keys(this.feedback).forEach(key => {
            if (typeof (this.feedback as any)[key] === 'number') (this.feedback as any)[key] = 0;
          });
          this.feedback.additionalComments = '';
        }
      },
      error: (error) => {
        console.error('Error checking feedback status:', error);
      }
    });
  }

  onRatingChange(rating: number, field: string): void {
    (this.feedback as any)[field] = rating;
  }

  getRatingValue(field: string): number {
    return (this.feedback as any)[field] ?? 0;
  }

  isFormValid(): boolean {
    const requiredFields = this.ratingCategories.map(cat => cat.key);
    return requiredFields.every(field => {
      const value = (this.feedback as any)[field];
      return typeof value === 'number' && value >= 1 && value <= 5;
    });
  }

  onSubmit(): void {
    if (!this.currentOffer || !this.isFormValid()) {
      this.showMessage('Please complete all required ratings (1-5 stars)', 'error');
      return;
    }

    this.isLoading = true;
    this.feedbackService.submitFeedback(this.feedback, this.studentId, this.currentOffer.id!).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showMessage('Feedback submitted successfully!', 'success');
        this.hasAlreadySubmitted = true;
        setTimeout(() => {
          this.router.navigate(['/student/tb']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting feedback:', error);
        this.showMessage(error.error?.message || 'Error submitting feedback', 'error');
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/student/tb']);
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}