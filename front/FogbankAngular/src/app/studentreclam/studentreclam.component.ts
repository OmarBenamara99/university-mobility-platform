import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../models/Reclamation';
import { ReclamationService } from '../service/reclamation.service';
import { AuthServiceService } from '../service/user/auth-service.service';

@Component({
  selector: 'app-studentreclam',
  templateUrl: './studentreclam.component.html',
  styleUrls: ['./studentreclam.component.css']
})
export class StudentreclamComponent implements OnInit{

reclamations: Reclamation[] = [];
  newReclamation: Reclamation = {
    subject: '',
    description: '',
    resolved: false
  };
  
  studentId: number;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private reclamationService: ReclamationService,
    private authService: AuthServiceService
  ) {
    const currentUser = this.authService.getCurrentUser();
this.studentId = currentUser?.id; // Extract the ID from the user object
  }

  ngOnInit(): void {
    this.loadStudentReclamations();
  }

  loadStudentReclamations(): void {
    this.reclamationService.getStudentReclamations(this.studentId).subscribe({
      next: (data) => {
        this.reclamations = data;
      },
      error: (error) => {
        console.error('Error loading reclamations:', error);
        this.showMessage('Erreur lors du chargement des réclamations', 'error');
      }
    });
  }

  onSubmit(): void {
    if (!this.newReclamation.subject || !this.newReclamation.description) {
      this.showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.isLoading = true;
    this.reclamationService.submitReclamation(this.newReclamation, this.studentId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showMessage('Réclamation soumise avec succès!', 'success');
        this.newReclamation = { subject: '', description: '', resolved: false };
        this.loadStudentReclamations(); // Refresh the list
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting reclamation:', error);
        this.showMessage('Erreur lors de la soumission', 'error');
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  getStatusText(reclamation: Reclamation): string {
    return reclamation.resolved ? 'Répondu' : 'En attente';
  }

  getStatusClass(reclamation: Reclamation): string {
    return reclamation.resolved ? 'text-success' : 'text-warning';
  }
}
