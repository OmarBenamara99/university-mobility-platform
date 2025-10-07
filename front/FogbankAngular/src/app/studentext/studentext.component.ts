import { Component, OnInit } from '@angular/core';
import { ExtensionRequest } from '../models/extension-request';
import { ExtensionRequestService } from '../service/extension-request.service';
import { AuthServiceService } from '../service/user/auth-service.service';

@Component({
  selector: 'app-studentext',
  templateUrl: './studentext.component.html',
  styleUrls: ['./studentext.component.css']
})
export class StudentextComponent implements OnInit {

extensionRequest: ExtensionRequest = {
    title: '',
    description: ''
  };
  
  selectedFile: File | null = null;
  isDragOver: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  studentId: number;

  constructor(
    private extensionService: ExtensionRequestService,
    private authService: AuthServiceService
  ) {
    const currentUser = this.authService.getCurrentUser();
    this.studentId = currentUser?.id;
  }

  ngOnInit(): void {}

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
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('Le fichier ne doit pas dépasser 5MB', 'error');
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (!this.extensionRequest.title || !this.extensionRequest.description) {
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.isLoading = true;
    
    this.extensionService.createExtensionRequest(
      this.extensionRequest, 
      this.studentId, 
  this.selectedFile || undefined  // Convert null to undefined
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showMessage('Demande d\'extension soumise avec succès!', 'success');
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.showMessage('Erreur lors de la soumission: ' + error.message, 'error');
        console.error('Submission error:', error);
      }
    });
  }

  private resetForm(): void {
    this.extensionRequest = {
      title: '',
      description: ''
    };
    this.selectedFile = null;
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
