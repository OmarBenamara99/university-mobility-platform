import { Component, OnInit } from '@angular/core';
import { AcceptanceProof } from '../models/acceptance-proof';
import { ProofStatus } from '../models/proof-status.enum';
import { AcceptanceProofService } from '../service/acceptance-proof.service';

@Component({
  selector: 'app-adminjustifacc',
  templateUrl: './adminjustifacc.component.html',
  styleUrls: ['./adminjustifacc.component.css']
})
export class AdminjustifaccComponent implements OnInit {

// Data
  acceptanceProofs: AcceptanceProof[] = [];
  filteredProofs: AcceptanceProof[] = [];
  selectedProofs: number[] = []; // Store selected proof IDs

  // Filters
  statusFilter: string = '';
  searchTerm: string = '';
  bulkActionStatus: ProofStatus = ProofStatus.APPROVED;

  // Loading states
  loading: boolean = true;
  processing: boolean = false;

  // Enum for template
  proofStatus = ProofStatus;

  constructor(private acceptanceProofService: AcceptanceProofService) {}

  ngOnInit(): void {
    this.loadAcceptanceProofs();
  }

  loadAcceptanceProofs(): void {
    this.loading = true;
    this.acceptanceProofService.getAllAdminProofs().subscribe({
      next: (proofs: AcceptanceProof[]) => {
        console.log('Raw proofs data:', proofs); // For debugging
        this.acceptanceProofs = proofs;
        this.filteredProofs = [...proofs];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading acceptance proofs:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredProofs = this.acceptanceProofs.filter(proof => {
      // Status filter
      if (this.statusFilter && proof.status !== this.statusFilter) {
        return false;
      }

      // Search term filter (you might want to add student name search later)
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        // Add student name search if you have access to candidature data
        // const matchesStudent = proof.candidature?.nom?.toLowerCase().includes(searchLower) ||
        //                       proof.candidature?.prenom?.toLowerCase().includes(searchLower);
        // if (!matchesStudent) return false;
      }

      return true;
    });
  }

  // Selection handling
  selectAll(event: any): void {
    if (event.target.checked) {
      this.selectedProofs = this.filteredProofs.map(proof => proof.id!);
    } else {
      this.selectedProofs = [];
    }
  }

  toggleSelection(proofId: number): void {
    const index = this.selectedProofs.indexOf(proofId);
    if (index > -1) {
      this.selectedProofs.splice(index, 1);
    } else {
      this.selectedProofs.push(proofId);
    }
  }

  isSelected(proofId: number): boolean {
    return this.selectedProofs.includes(proofId);
  }

  // Document download
  downloadDocument(proofId: number): void {
    this.acceptanceProofService.downloadDocument(proofId).subscribe({
      next: (blob: Blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'acceptance-document.pdf'; // You might want to get actual filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading document:', err);
        alert('Erreur lors du téléchargement du document');
      }
    });
  }

  // Status change handler
  onStatusChange(event: Event, proofId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    this.updateStatus(proofId, selectElement.value as ProofStatus);
  }

  // Status update
  updateStatus(proofId: number, newStatus: ProofStatus): void {
    this.processing = true;
    this.acceptanceProofService.updateStatus(proofId, newStatus).subscribe({
      next: (updatedProof) => {
        // Update local data
        const index = this.acceptanceProofs.findIndex(p => p.id === proofId);
        if (index > -1) {
          this.acceptanceProofs[index] = updatedProof;
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
    if (this.selectedProofs.length === 0) return;

    this.processing = true;
    const promises = this.selectedProofs
      .filter(proofId => proofId !== undefined)
      .map(proofId => this.acceptanceProofService.updateStatus(proofId!, this.bulkActionStatus).toPromise()
    );

    Promise.all(promises).then(results => {
      // Update local data
      results.forEach(updatedProof => {
        if (updatedProof) {
          const index = this.acceptanceProofs.findIndex(p => p.id === updatedProof.id);
          if (index > -1) {
            this.acceptanceProofs[index] = updatedProof;
          }
        }
      });
      
      this.applyFilters();
      this.selectedProofs = []; // Clear selection
      this.processing = false;
    }).catch(err => {
      console.error('Error in bulk action:', err);
      alert('Erreur lors de la mise à jour groupée');
      this.processing = false;
    });
  }

  // View details (modal or separate page)
  viewDetails(proof: AcceptanceProof): void {
    console.log('View details:', proof);
    // Implement modal or detail page navigation
  }

  // Helper methods
  getStatusText(status: string): string {
    switch (status) {
      case ProofStatus.PENDING_UPLOAD:
        return 'En attente document';
      case ProofStatus.UNDER_REVIEW:
        return 'En revue';
      case ProofStatus.APPROVED:
        return 'Approuvé';
      case ProofStatus.REJECTED:
        return 'Rejeté';
      case ProofStatus.CANCELLED:
        return 'Annulé';
      default:
        return status;
    }
  }
}
