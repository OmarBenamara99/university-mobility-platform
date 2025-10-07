import { Component, OnInit } from '@angular/core';
import { ExtensionRequest } from '../models/extension-request';
import { ExtensionStatus } from '../models/extension-status.enum';
import { ExtensionRequestService } from '../service/extension-request.service';

@Component({
  selector: 'app-adminext',
  templateUrl: './adminext.component.html',
  styleUrls: ['./adminext.component.css']
})
export class AdminextComponent implements OnInit {

extensionRequests: ExtensionRequest[] = [];
  isLoading: boolean = false;
  selectedRequestId: number | null = null;
  adminResponse: string = '';
  // Expose the enum to the template
ExtensionStatus = ExtensionStatus;

  constructor(private extensionService: ExtensionRequestService) {}

  ngOnInit(): void {
    this.loadExtensionRequests();
  }

  loadExtensionRequests(): void {
    this.isLoading = true;
    this.extensionService.getAllExtensionRequests().subscribe({
      next: (requests) => {
        this.extensionRequests = requests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading extension requests:', error);
        this.isLoading = false;
      }
    });
  }

  openResponseForm(requestId: number): void {
    this.selectedRequestId = requestId;
    this.adminResponse = '';
  }

  cancelResponse(): void {
    this.selectedRequestId = null;
    this.adminResponse = '';
  }

  updateRequestStatus(requestId: number, status: ExtensionStatus): void {
    this.extensionService.updateRequestStatus(requestId, status, this.adminResponse).subscribe({
      next: (updatedRequest) => {
        this.loadExtensionRequests(); // Reload the list
        this.selectedRequestId = null;
        this.adminResponse = '';
      },
      error: (error) => {
        console.error('Error updating request status:', error);
      }
    });
  }

  downloadFile(requestId: number, fileName: string): void {
    this.extensionService.downloadRequestFile(requestId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        alert('Erreur lors du téléchargement du fichier');
      }
    });
  }

  getStatusText(status: ExtensionStatus | undefined): string {
    switch (status) {
      case ExtensionStatus.PENDING: return 'En Attente';
      case ExtensionStatus.UNDER_REVIEW: return 'En Cours';
      case ExtensionStatus.APPROVED: return 'Approuvée';
      case ExtensionStatus.REJECTED: return 'Rejetée';
      default: return 'Inconnu';
    }
  }

  getStatusBadgeClass(status: ExtensionStatus | undefined): string {
    switch (status) {
      case ExtensionStatus.PENDING: return 'badge-warning';
      case ExtensionStatus.UNDER_REVIEW: return 'badge-info';
      case ExtensionStatus.APPROVED: return 'badge-success';
      case ExtensionStatus.REJECTED: return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}
