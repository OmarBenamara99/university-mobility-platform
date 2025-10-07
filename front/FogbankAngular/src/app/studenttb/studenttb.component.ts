import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/user/auth-service.service';
import { MobilityProcessService } from '../service/mobility-process.service';

@Component({
  selector: 'app-studenttb',
  templateUrl: './studenttb.component.html',
  styleUrls: ['./studenttb.component.css']
})
export class StudenttbComponent implements OnInit{

  activeSection: string | null = null;
  hasMobilityAccess: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private mobilityProcessService: MobilityProcessService,
    private authService: AuthServiceService) {}

    ngOnInit(): void {
    this.checkMobilityAccess();
  }

  goTo(path: string): void {
  this.router.navigate([path]);
}

  toggleContent(section: string): void {
    // Prevent access to preparation if not authorized
    if (section === 'preparationDepart' && !this.hasMobilityAccess) {
      alert('Vous devez compléter toutes les étapes de validation pour accéder à cette section.');
      return;
    }
  this.activeSection = this.activeSection === section ? null : section;
}



checkMobilityAccess(): void {
    const user = this.authService.getCurrentUser();
    console.log('🔍 Current user:', user); // DEBUG
    if (!user?.id) {
      this.hasMobilityAccess = false;
          console.log('❌ No user ID found'); // DEBUG

      return;
    }

    this.loading = true;
      console.log('📡 Checking access for user ID:', user.id); // DEBUG

    this.mobilityProcessService.checkStudentAccess(user.id).subscribe({
      next: (hasAccess) => {
              console.log('✅ Access result:', hasAccess); // DEBUG

        this.hasMobilityAccess = hasAccess;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error checking access:', err);
              console.error('❌ Error checking access:', err); // DEBUG

        this.hasMobilityAccess = false;
        this.loading = false;
      }
    });
  }

  navigateTo(section: string): void {
    if (!this.hasMobilityAccess) {
      alert('Vous devez compléter toutes les étapes de validation pour accéder à cette section.');
      return;
    }

    switch(section) {
      case 'informations-pratiques':
        this.router.navigate(['/student/infprat']);
        break;
      case 'ordre-mission':  // ← CHANGED FROM 'liste-taches'
      this.router.navigate(['/student/ordmis']);
      break;
      case 'forums':
        this.router.navigate(['/student/msgs']);
        break;
      case 'messagerie':
        this.router.navigate(['/student/preparation/messagerie']);
        break;
      default:
        this.router.navigate(['/student/preparation']);
    }
  }

}
