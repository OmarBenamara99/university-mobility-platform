import { Component } from '@angular/core';
import { Reclamation } from '../models/Reclamation';
import { ReclamationService } from '../service/reclamation.service';

@Component({
  selector: 'app-adminreclam',
  templateUrl: './adminreclam.component.html',
  styleUrls: ['./adminreclam.component.css']
})
export class AdminreclamComponent {

reclamations: Reclamation[] = [];
  unresolvedReclamations: Reclamation[] = [];
  resolvedReclamations: Reclamation[] = [];
  selectedTab: 'unresolved' | 'resolved' = 'unresolved';
  isLoading: boolean = false;
  responseText: string = '';
  selectedReclamationId: number | null = null;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadUnresolvedReclamations();
  }

  loadUnresolvedReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getUnresolvedReclamations().subscribe({
      next: (data) => {
        this.unresolvedReclamations = data;
        this.reclamations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading unresolved reclamations:', error);
        this.isLoading = false;
      }
    });
  }

  loadResolvedReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getResolvedReclamations().subscribe({
      next: (data) => {
        this.resolvedReclamations = data;
        this.reclamations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resolved reclamations:', error);
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: 'unresolved' | 'resolved'): void {
    this.selectedTab = tab;
    this.selectedReclamationId = null;
    this.responseText = '';
    
    if (tab === 'unresolved') {
      this.loadUnresolvedReclamations();
    } else {
      this.loadResolvedReclamations();
    }
  }

  openResponseForm(reclamationId: number): void {
    this.selectedReclamationId = reclamationId;
    this.responseText = '';
  }

  cancelResponse(): void {
    this.selectedReclamationId = null;
    this.responseText = '';
  }

  submitResponse(reclamationId: number): void {
    if (!this.responseText.trim()) {
      return;
    }

    this.isLoading = true;
    this.reclamationService.respondToReclamation(reclamationId, this.responseText).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.selectedReclamationId = null;
        this.responseText = '';
        this.loadUnresolvedReclamations(); // Refresh the list
      },
      error: (error) => {
        console.error('Error responding to reclamation:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusText(reclamation: Reclamation): string {
    return reclamation.resolved ? 'Résolu' : 'Non résolu';
  }

  getStatusClass(reclamation: Reclamation): string {
    return reclamation.resolved ? 'text-success' : 'text-warning';
  }
}
