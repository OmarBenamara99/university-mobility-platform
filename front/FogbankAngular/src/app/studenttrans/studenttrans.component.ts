import { Component, OnInit } from '@angular/core';
import { EquivalenceService } from '../service/equivalence.service';
import { OffreService } from '../service/offre.service';
import { AuthServiceService } from '../service/user/auth-service.service';
import { Offre } from '../models/offre';

@Component({
  selector: 'app-studenttrans',
  templateUrl: './studenttrans.component.html',
  styleUrls: ['./studenttrans.component.css']
})
export class StudenttransComponent implements OnInit {

  acceptedOffers: Offre[] = [];
  selectedOfferId: number | null = null;
  transcriptFile: File | null = null;
  isDragOver: boolean = false;
  loading: boolean = false;
  submitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  studentId: number;

  constructor(
    private equivalenceService: EquivalenceService,
    private offreService: OffreService,
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
        this.errorMessage = 'Erreur lors du chargement de vos offres';
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  handleFileSelection(file: File): void {
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Veuillez sélectionner un fichier PDF';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Le fichier ne doit pas dépasser 5MB';
      return;
    }

    this.transcriptFile = file;
    this.errorMessage = '';
  }

  removeFile(): void {
    this.transcriptFile = null;
  }

  canSubmit(): boolean {
    return !!this.selectedOfferId && !!this.transcriptFile;
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.equivalenceService.uploadStudentTranscript(
      this.transcriptFile!,
      this.studentId,
      this.selectedOfferId!,
      this.transcriptFile!.name
    ).subscribe({
      next: (response) => {
        this.submitting = false;
        this.successMessage = 'Relevé de notes téléchargé avec succès!';
        this.transcriptFile = null;
        this.selectedOfferId = null;
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = 'Erreur lors du téléchargement: ' + (error.error?.message || error.message);
        console.error('Upload error:', error);
      }
    });
  }
}