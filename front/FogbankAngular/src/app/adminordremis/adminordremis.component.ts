import { Component, OnInit } from '@angular/core';
import { Offre } from '../models/offre';
import { OffreService } from '../service/offre.service';
import { OrdreMissionService } from '../service/ordre-mission.service';

@Component({
  selector: 'app-adminordremis',
  templateUrl: './adminordremis.component.html',
  styleUrls: ['./adminordremis.component.css']
})
export class AdminordremisComponent implements OnInit{
  offres: Offre[] = [];
  selectedFile: File | null = null;
  isDragOver = false;
  uploadInProgress: { [offerId: number]: boolean } = {};
  uploadSuccess: { [offerId: number]: boolean } = {};
  uploadError: { [offerId: number]: string } = {};

  constructor(
    private offreService: OffreService,
    private ordreMissionService: OrdreMissionService
  ) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.offreService.getAll().subscribe({
      next: (offres) => {
        this.offres = offres;
      },
      error: (err) => {
        console.error('Error loading offers:', err);
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadOrdreMission(offerId: number): void {
    if (!this.selectedFile) {
      this.uploadError[offerId] = 'Veuillez sélectionner un fichier';
      return;
    }

    // Validate file type (PDF recommended for Ordre de Mission)
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.uploadError[offerId] = 'Seuls les fichiers PDF sont acceptés';
      return;
    }

    // Validate file size (max 5MB)
    const maxSizeMB = 5;
    if (this.selectedFile.size > maxSizeMB * 1024 * 1024) {
      this.uploadError[offerId] = `La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`;
      return;
    }

    this.uploadInProgress[offerId] = true;
    this.uploadError[offerId] = '';
    this.uploadSuccess[offerId] = false;

    this.ordreMissionService.uploadOrdreMission(offerId, this.selectedFile).subscribe({
      next: (response) => {
        this.uploadInProgress[offerId] = false;
        this.uploadSuccess[offerId] = true;
        this.selectedFile = null;
        console.log('Ordre de Mission uploaded successfully:', response);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.uploadSuccess[offerId] = false;
        }, 3000);
      },
      error: (err) => {
        this.uploadInProgress[offerId] = false;
        this.uploadError[offerId] = 'Erreur lors du téléchargement: ' + (err.error?.message || err.message);
        console.error('Error uploading ordre mission:', err);
      }
    });
  }

  clearFileSelection(): void {
    this.selectedFile = null;
    // Clear all error messages
    this.uploadError = {};
  }

  getFileName(): string {
    return this.selectedFile ? this.selectedFile.name : 'Aucun fichier sélectionné';
  }

}
