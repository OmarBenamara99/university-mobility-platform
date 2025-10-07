import { Component, OnInit } from '@angular/core';
import { AdministrativeFile } from '../models/administrative-file';
import { FileStatus } from '../models/file-status.enum';
import { PaymentMethod } from '../models/payment-method.enum';
import { CandidatureService } from '../service/candidature.service';
import { AuthServiceService } from '../service/user/auth-service.service';
import { AdministrativeFileServiceService } from '../service/administrative-file-service.service';

@Component({
  selector: 'app-studentreguladmin',
  templateUrl: './studentreguladmin.component.html',
  styleUrls: ['./studentreguladmin.component.css']
})
export class StudentreguladminComponent implements OnInit {

// Enums for template access
  paymentMethods = PaymentMethod;
  fileStatus = FileStatus;

  // Component state
  administrativeFile: AdministrativeFile | null = null;
  receiptFile: File | null = null;
  chequesFile: File | null = null;
  isDragOver = false;
  loading = true;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private administrativeFileService: AdministrativeFileServiceService,
    private candidatureService: CandidatureService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loadAdministrativeFile();
  }

  loadAdministrativeFile(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.loading = false;
      this.errorMessage = 'Utilisateur non identifié';
      return;
    }

    this.loading = true;
    this.administrativeFileService.getByUserId(user.id).subscribe({
      next: (files: AdministrativeFile[]) => {
        // Get the first administrative file (should only be one for confirmed students)
        this.administrativeFile = files.length > 0 ? files[0] : null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading administrative file:', err);
        this.errorMessage = 'Erreur lors du chargement du dossier';
        this.loading = false;
      }
    });
  }

  onPaymentMethodChange(): void {
    if (!this.administrativeFile?.id) return;

    this.administrativeFileService.updatePaymentMethod(
      this.administrativeFile.id, 
      this.administrativeFile.paymentMethod!
    ).subscribe({
      next: (updatedFile) => {
        this.administrativeFile = updatedFile;
        this.successMessage = 'Mode de paiement enregistré';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error updating payment method:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du mode de paiement';
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

  onDrop(event: DragEvent, type: 'receipt' | 'cheques'): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0], type);
    }
  }

  onFileSelected(event: Event, type: 'receipt' | 'cheques'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0], type);
    }
  }

  private handleFileSelection(file: File, type: 'receipt' | 'cheques'): void {
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

    if (type === 'receipt') {
      this.receiptFile = file;
    } else {
      this.chequesFile = file;
    }

    this.errorMessage = '';
  }

  removeFile(type: 'receipt' | 'cheques'): void {
    if (type === 'receipt') {
      this.receiptFile = null;
    } else {
      this.chequesFile = null;
    }
  }

  canSubmit(): boolean {
    if (!this.administrativeFile?.paymentMethod) return false;

    if (this.administrativeFile.paymentMethod === PaymentMethod.IMMEDIATE_FULL_PAYMENT) {
      return !!this.receiptFile;
    } else if (this.administrativeFile.paymentMethod === PaymentMethod.PAYMENT_BY_CHEQUES) {
      return !!this.chequesFile;
    }

    return false;
  }

  onSubmit(): void {
    if (!this.administrativeFile?.id || !this.canSubmit()) return;

    this.submitting = true;
    this.errorMessage = '';

    const fileToUpload = this.administrativeFile.paymentMethod === PaymentMethod.IMMEDIATE_FULL_PAYMENT 
      ? this.receiptFile! 
      : this.chequesFile!;

    const uploadObservable = this.administrativeFile.paymentMethod === PaymentMethod.IMMEDIATE_FULL_PAYMENT
      ? this.administrativeFileService.uploadReceipt(this.administrativeFile.id, fileToUpload)
      : this.administrativeFileService.uploadCheques(this.administrativeFile.id, fileToUpload);

    uploadObservable.subscribe({
      next: (updatedFile) => {
        this.administrativeFile = updatedFile;
        this.receiptFile = null;
        this.chequesFile = null;
        this.submitting = false;
        this.successMessage = 'Document uploadé avec succès! Votre dossier est en cours de vérification.';
      },
      error: (err) => {
        console.error('Error uploading file:', err);
        this.errorMessage = 'Erreur lors de l\'upload du document';
        this.submitting = false;
      }
    });
  }

  getStatusText(status: FileStatus): string {
    switch (status) {
      case FileStatus.PENDING_PAYMENT_CHOICE:
        return 'En attente du choix de paiement';
      case FileStatus.PENDING_UPLOAD:
        return 'En attente des documents';
      case FileStatus.UNDER_REVIEW:
        return 'En cours de vérification';
      case FileStatus.COMPLETED:
        return 'Complété';
      case FileStatus.CANCELLED:
        return 'Annulé';
      default:
        return 'Statut inconnu';
    }
  }
}
