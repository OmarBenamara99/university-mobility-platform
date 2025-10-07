import { Component, OnInit } from '@angular/core';
import { AcceptanceProof } from '../models/acceptance-proof';
import { FileStatus } from '../models/file-status.enum';
import { ProofStatus } from '../models/proof-status.enum';
import { AcceptanceProofService } from '../service/acceptance-proof.service';
import { AuthServiceService } from '../service/user/auth-service.service';
import { AdministrativeFileServiceService } from '../service/administrative-file-service.service';

@Component({
  selector: 'app-studentjustifacc',
  templateUrl: './studentjustifacc.component.html',
  styleUrls: ['./studentjustifacc.component.css']
})
export class StudentjustifaccComponent implements OnInit {
  // Enums for template access
  proofStatus = ProofStatus;
  fileStatus = FileStatus;

  // Component state
  acceptanceProof: AcceptanceProof | null = null;
  documentFile: File | null = null;
  isDragOver = false;
  loading = true;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  hasCompletedAdministrative = false;

  constructor(
    private acceptanceProofService: AcceptanceProofService,
    private administrativeFileService: AdministrativeFileServiceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loadAcceptanceProof();
    this.checkAdministrativeStatus();
  }

  loadAcceptanceProof(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.loading = false;
      this.errorMessage = 'Utilisateur non identifié';
      return;
    }

    this.loading = true;
    this.acceptanceProofService.getByUserId(user.id).subscribe({
      next: (proofs: AcceptanceProof[]) => {
        // Get the first acceptance proof (should only be one for confirmed students)
        this.acceptanceProof = proofs.length > 0 ? proofs[0] : null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading acceptance proof:', err);
        this.errorMessage = 'Erreur lors du chargement du justificatif';
        this.loading = false;
      }
    });
  }

  checkAdministrativeStatus(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;

    this.administrativeFileService.getByUserId(user.id).subscribe({
      next: (files) => {
        // Check if user has a completed administrative file
        this.hasCompletedAdministrative = files.some(file => 
          file.status === FileStatus.COMPLETED
        );
      },
      error: (err) => {
        console.error('Error checking administrative status:', err);
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0]);
    }
  }

  private handleFileSelection(file: File): void {
    // Validate file type
    const validTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      this.errorMessage = 'Format de fichier non supporté. Utilisez PDF, JPG, JPEG ou PNG.';
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Fichier trop volumineux. Maximum 5MB autorisé.';
      return;
    }

    this.documentFile = file;
    this.errorMessage = '';
  }

  removeFile(): void {
    this.documentFile = null;
  }

  onSubmit(): void {
    if (!this.acceptanceProof?.id || !this.documentFile) return;

    this.submitting = true;
    this.errorMessage = '';

    this.acceptanceProofService.uploadDocument(this.acceptanceProof.id, this.documentFile).subscribe({
      next: (updatedProof) => {
        this.acceptanceProof = updatedProof;
        this.documentFile = null;
        this.submitting = false;
        this.successMessage = 'Document uploadé avec succès! Votre justificatif est en cours de vérification.';
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        console.error('Error uploading document:', err);
        this.errorMessage = 'Erreur lors de l\'upload du document';
        this.submitting = false;
      }
    });
  }

  getStatusText(status: ProofStatus): string {
    switch (status) {
      case ProofStatus.PENDING_UPLOAD:
        return 'En attente du document';
      case ProofStatus.UNDER_REVIEW:
        return 'En cours de vérification';
      case ProofStatus.APPROVED:
        return 'Approuvé';
      case ProofStatus.REJECTED:
        return 'Rejeté';
      case ProofStatus.CANCELLED:
        return 'Annulé';
      default:
        return 'Statut inconnu';
    }
  }

  // Optional: Method to check if user can access this component
  canAccessProof(): boolean {
    return this.hasCompletedAdministrative && !!this.acceptanceProof;
  }

}
