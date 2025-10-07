import { Component, OnInit } from '@angular/core';
import { EquivalenceDocument } from '../models/EquivalenceDocument';
import { Offre } from '../models/offre';
import { EquivalenceService } from '../service/equivalence.service';
import { OffreService } from '../service/offre.service';
import { ExamChoice } from '../models/ExamChoice';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admineq',
  templateUrl: './admineq.component.html',
  styleUrls: ['./admineq.component.css']
})
export class AdmineqComponent implements OnInit{

offres: Offre[] = [];
  selectedFile: File | null = null;
  isDragOver: boolean = false;
  uploadInProgress: { [key: number]: boolean } = {};
  uploadSuccess: { [key: number]: boolean } = {};
  uploadError: { [key: number]: string } = {};
  documentsByOffer: { [key: number]: EquivalenceDocument[] } = {};
transcriptsMap: Map<number, EquivalenceDocument> = new Map();
// Add these properties for the transcripts table
studentTranscripts: EquivalenceDocument[] = [];
isLoadingTranscripts: boolean = false;
currentTranscriptPage: number = 0;
totalTranscriptPages: number = 0;
  // Add these properties
examChoices: ExamChoice[] = [];
selectedOfferFilter: number | null = null;
selectedChoiceFilter: string | null = null;
isLoadingChoices: boolean = false;
currentPage: number = 0;
pageSize: number = 10;
totalPages: number = 0;

  constructor(
    private equivalenceService: EquivalenceService,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
  this.loadOffers();
  this.loadAllTranscripts();
  this.loadStudentTranscripts();
}

  

   // Add this method to load all student transcripts
  loadAllTranscripts(): void {
  this.equivalenceService.getAllStudentTranscripts().subscribe({
    next: (transcripts) => {
      // Create a map for quick lookup: key = studentId (number), value = transcript
      this.transcriptsMap.clear();
      transcripts.forEach(transcript => {
        if (transcript.studentId) {
          this.transcriptsMap.set(transcript.studentId, transcript);
        }
      });
    },
    error: (error) => {
      console.error('Error loading transcripts:', error);
    }
  });
}

// Add this method to load all student transcripts for the new table
loadStudentTranscripts(): void {
  this.isLoadingTranscripts = true;
  this.equivalenceService.getAllStudentTranscripts().subscribe({
    next: (transcripts) => {
      this.studentTranscripts = transcripts;
      this.isLoadingTranscripts = false;
    },
    error: (error) => {
      console.error('Error loading student transcripts:', error);
      this.isLoadingTranscripts = false;
      this.studentTranscripts = [];
    }
  });
}

// Add this method for transcript pagination
changeTranscriptPage(page: number): void {
  this.currentTranscriptPage = page;
  // Implement pagination logic if needed
}

  // Add this method to get transcript for a specific student and offer
 getStudentTranscript(studentId: number): EquivalenceDocument | null {
  return this.transcriptsMap.get(studentId) || null;
}
  // Add this method to download a specific transcript
  downloadStudentTranscript(transcript: EquivalenceDocument): void {
    this.equivalenceService.downloadDocument(transcript.id!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = transcript.originalFileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading transcript:', error);
        alert('Erreur lors du téléchargement du relevé de notes');
      }
    });
  }

  // Update loadOffers to return a Promise
loadOffers(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.offreService.getAll().subscribe({
      next: (offers) => {
        this.offres = offers;
        // Load documents for each offer
        this.offres.forEach(offer => {
          this.loadDocumentsForOffer(offer.id!);
        });
        resolve();
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        reject(error);
      }
    });
  });
}

  loadDocumentsForOffer(offerId: number): void {
    this.equivalenceService.getDocumentsByOffer(offerId).subscribe({
      next: (documents) => {
        this.documentsByOffer[offerId] = documents;
      },
      error: (error) => {
        console.error('Error loading documents for offer:', offerId, error);
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  handleFileSelection(file: File): void {
    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier ne doit pas dépasser 5MB');
      return;
    }

    this.selectedFile = file;
  }

  getFileName(): string {
    return this.selectedFile?.name || '';
  }

  clearFileSelection(): void {
    this.selectedFile = null;
  }

  uploadDocument(offerId: number): void {
    if (!this.selectedFile) return;

    this.uploadInProgress[offerId] = true;
    this.uploadError[offerId] = '';
    this.uploadSuccess[offerId] = false;

    this.equivalenceService.uploadDocument(
      this.selectedFile,
      offerId,
      this.selectedFile.name
    ).subscribe({
      next: (document) => {
        this.uploadInProgress[offerId] = false;
        this.uploadSuccess[offerId] = true;
        this.selectedFile = null;
        this.loadDocumentsForOffer(offerId); // Refresh documents list
      },
      error: (error) => {
        this.uploadInProgress[offerId] = false;
        this.uploadError[offerId] = 'Erreur lors du téléchargement: ' + error.message;
        console.error('Upload error:', error);
      }
    });
  }

  downloadDocument(doc: EquivalenceDocument): void {
  this.equivalenceService.downloadDocument(doc.id!).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a'); // Changed variable name
      downloadLink.href = url;
      downloadLink.download = doc.originalFileName;
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Error downloading document:', error);
      alert('Erreur lors du téléchargement du document');
    }
  });
}

  deleteDocument(documentId: number, offerId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.equivalenceService.deleteDocument(documentId).subscribe({
        next: () => {
          this.loadDocumentsForOffer(offerId); // Refresh documents list
        },
        error: (error) => {
          console.error('Error deleting document:', error);
          alert('Erreur lors de la suppression du document');
        }
      });
    }
  }







  // Add these methods
// Update the loadExamChoices method to ensure transcripts are loaded
  loadExamChoices(): void {
    this.isLoadingChoices = true;
    
    if (this.selectedOfferFilter) {
      this.equivalenceService.getOfferExamChoices(this.selectedOfferFilter).subscribe({
        next: (choices) => {
          this.examChoices = this.filterChoices(choices);
          this.isLoadingChoices = false;
        },
        error: (error) => {
          console.error('Error loading exam choices:', error);
          this.isLoadingChoices = false;
        }
      });
    } else {
      this.equivalenceService.getAllExamChoices().subscribe({
        next: (allChoices) => {
          this.examChoices = this.filterChoices(allChoices);
          this.isLoadingChoices = false;
        },
        error: (error) => {
          console.error('Error loading all exam choices:', error);
          this.isLoadingChoices = false;
          this.examChoices = [];
        }
      });
    }
  }

loadAllExamChoices(): void {
  this.isLoadingChoices = true;
  
  this.equivalenceService.getAllExamChoices().subscribe({
    next: (allChoices) => {
      this.examChoices = this.filterChoices(allChoices);
      this.isLoadingChoices = false;
    },
    error: (error) => {
      console.error('Error loading all exam choices:', error);
      this.isLoadingChoices = false;
      this.examChoices = [];
    }
  });
}

filterChoices(choices: ExamChoice[]): ExamChoice[] {
  let filtered = choices;
  
  // Only filter if a specific choice is selected
  if (this.selectedChoiceFilter) {
    filtered = filtered.filter(choice => choice.choice === this.selectedChoiceFilter);
  }
  
  return filtered;
}

getChoiceText(choice: string): string {
  const choices = {
    'ESPRIT': 'ESPIRIT',
    'PARTNER_UNIVERSITY': 'Université Partenaire', 
    'COMBINATION': 'Combinaison'
  };
  return choices[choice as keyof typeof choices] || choice;
}

changePage(page: number): void {
  this.currentPage = page;
  // Implement pagination logic if needed
}

exportToCSV(): void {
  // Implement CSV export logic
  console.log('Exporting to CSV...');
}
}