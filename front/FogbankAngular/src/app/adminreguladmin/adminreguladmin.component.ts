import { Component, OnInit } from '@angular/core';
import { AdministrativeFile } from '../models/administrative-file';
import { FileStatus } from '../models/file-status.enum';
import { PaymentMethod } from '../models/payment-method.enum';
import { AdministrativeFileServiceService } from '../service/administrative-file-service.service';

@Component({
  selector: 'app-adminreguladmin',
  templateUrl: './adminreguladmin.component.html',
  styleUrls: ['./adminreguladmin.component.css']
})
export class AdminreguladminComponent implements OnInit{

// Data
  administrativeFiles: AdministrativeFile[] = [];
  filteredFiles: AdministrativeFile[] = [];
  selectedFiles: number[] = []; // Store selected file IDs

  // Filters
  statusFilter: string = '';
  paymentMethodFilter: string = '';
  searchTerm: string = '';
  bulkActionStatus: FileStatus = FileStatus.COMPLETED;

  // Loading states
  loading: boolean = true;
  processing: boolean = false;

  // Enums for template
  fileStatus = FileStatus;
  paymentMethods = PaymentMethod;

  constructor(private administrativeFileService: AdministrativeFileServiceService) {}

  ngOnInit(): void {
    this.loadAdministrativeFiles();
  }

  loadAdministrativeFiles(): void {
    this.loading = true;
    this.administrativeFileService.getAllAdminFiles().subscribe({
      next: (files: AdministrativeFile[]) => {
        console.log('Raw files data:', files);
        this.administrativeFiles = files;
        this.filteredFiles = [...files];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading administrative files:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredFiles = this.administrativeFiles.filter(file => {
      // Status filter
      if (this.statusFilter && file.status !== this.statusFilter) {
        return false;
      }

      // Payment method filter
      if (this.paymentMethodFilter && file.paymentMethod !== this.paymentMethodFilter) {
        return false;
      }

      // Search term filter (student name or email)
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesStudent = file.candidature?.nom?.toLowerCase().includes(searchLower) ||
                              file.candidature?.prenom?.toLowerCase().includes(searchLower) ||
                              file.candidature?.email?.toLowerCase().includes(searchLower);
        const matchesUniversity = file.candidature?.offre?.universite?.toLowerCase().includes(searchLower);
        
        if (!matchesStudent && !matchesUniversity) {
          return false;
        }
      }

      return true;
    });
  }

  // Selection handling
  selectAll(event: any): void {
    if (event.target.checked) {
      this.selectedFiles = this.filteredFiles.map(file => file.id!);
    } else {
      this.selectedFiles = [];
    }
  }

  toggleSelection(fileId: number | undefined): void {
     if (!fileId) return;
    const index = this.selectedFiles.indexOf(fileId);
    if (index > -1) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles.push(fileId);
    }
  }

  isSelected(fileId: number | undefined): boolean {
    return fileId ? this.selectedFiles.includes(fileId) : false;
  }

  // File download
  downloadFile(fileId: number | undefined, fileType: 'receipt' | 'cheques'): void {
    if (!fileId) return;
    this.administrativeFileService.downloadFile(fileId, fileType).subscribe({
      next: (blob: Blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Get filename from service or use default
        a.download = fileType === 'receipt' ? 'receipt.pdf' : 'cheques.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        alert('Erreur lors du téléchargement du fichier');
      }
    });
  }

  // Status update
  updateStatus(fileId: number | undefined, newStatus: string): void {
    if (!fileId) return;
    this.processing = true;
    this.administrativeFileService.updateStatus(fileId, newStatus as FileStatus).subscribe({
      next: (updatedFile) => {
        // Update local data
        const index = this.administrativeFiles.findIndex(f => f.id === fileId);
        if (index > -1) {
          this.administrativeFiles[index] = updatedFile;
        }
        this.applyFilters(); // Reapply filters to refresh view
        this.processing = false;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Erreur lors de la mise à jour du statut');
        this.processing = false;
      }
    });
  }

  // Bulk actions
  applyBulkAction(): void {
    if (this.selectedFiles.length === 0) return;

  this.processing = true;
  const promises = this.selectedFiles
    .filter(fileId => fileId !== undefined) // Filter out undefined
    .map(fileId => this.administrativeFileService.updateStatus(fileId!, this.bulkActionStatus).toPromise()
  );

    Promise.all(promises).then(results => {
      // Update local data
      results.forEach(updatedFile => {
        if (updatedFile) {
          const index = this.administrativeFiles.findIndex(f => f.id === updatedFile.id);
          if (index > -1) {
            this.administrativeFiles[index] = updatedFile;
          }
        }
      });
      
      this.applyFilters();
      this.selectedFiles = []; // Clear selection
      this.processing = false;
    }).catch(err => {
      console.error('Error in bulk action:', err);
      alert('Erreur lors de la mise à jour groupée');
      this.processing = false;
    });
  }

  // View details (modal or separate page)
  viewDetails(file: AdministrativeFile): void {
    // You can implement a modal or navigation to detail page
    console.log('View details:', file);
    // this.router.navigate(['/admin/administrative-files', file.id]);
  }

  // Helper methods
  getStatusText(status: string): string {
    switch (status) {
      case FileStatus.PENDING_PAYMENT_CHOICE:
        return 'En attente choix';
      case FileStatus.PENDING_UPLOAD:
        return 'Documents attendus';
      case FileStatus.UNDER_REVIEW:
        return 'En revue';
      case FileStatus.COMPLETED:
        return 'Complété';
      case FileStatus.CANCELLED:
        return 'Annulé';
      default:
        return status;
    }
  }

  getPaymentMethodText(method: string): string {
    return method === PaymentMethod.IMMEDIATE_FULL_PAYMENT ? 'Immédiat' : 'Chèques';
  }

  onStatusChange(fileId: number, event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  this.updateStatus(fileId, selectElement.value);
}
}
