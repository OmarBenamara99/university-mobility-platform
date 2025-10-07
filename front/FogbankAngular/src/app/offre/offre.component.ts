import { Component, OnInit } from '@angular/core';
import { Offre } from '../models/offre';
import { OffreService } from '../service/offre.service';
import { Universite } from '../models/universite.enum';
import { OffreType } from '../models/offre-type.enum';
import { OptionEsprit } from '../models/option-esprit.enum';
import { Pays } from '../models/pays.enum';
import { FieldDisponible } from '../models/fielddispo.enum';
import ImageCompressor from 'image-compressor.js';



@Component({
  selector: 'app-offre',
  templateUrl: './offre.component.html',
  styleUrls: ['./offre.component.css']
})
export class OffreComponent implements OnInit{

  offres: Offre[] = [];
  
  newOffre: Offre = {
  titre: '',
  description: '',
  dateDebut: '',
  dateFin: '',
  type: undefined as any,             // Will bind from select
  universite: undefined as any,       // Will bind from select
  optionsConcernees: [],
  fieldsDisponibles: [],
  pays: undefined as any,             // Will bind from select
  nombrePlaces: 0,
  active: true,
  imageUrls: [] as string[]
};

  showForm = false;

  modeFormulaire: 'affichage' | 'ajout' | 'modification' = 'affichage';
  offreToEdit: any = null;

  statut: boolean = true;
  Universite = Object.values(Universite);
  OffreType = Object.values(OffreType);
  OptionEsprit = Object.values(OptionEsprit);
  Pays = Object.values(Pays);
  FieldDisponible = Object.values(FieldDisponible);

  isDragOver = false;
  imagePreviews: string[] = [];
  selectedImages: File[] = [];





  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onToggleStatut(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  this.newOffre.active = checkbox.checked;
}


   loadOffres(): void {
    this.offreService.getAll().subscribe({
      next: (data) => this.offres = data,
      error: (err) => console.error('Erreur chargement offres:', err)
    });
  }

  resetForm(): void {
  this.newOffre = {
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    type: undefined as any,
    universite: undefined as any,
    optionsConcernees: [],
    fieldsDisponibles: [],
    pays: undefined as any,
    nombrePlaces: 0,
    active: true,
    imageUrls: []
  };
}

onOptionChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const value = checkbox.value as OptionEsprit;

  if (checkbox.checked) {
    this.newOffre.optionsConcernees.push(value);
  } else {
    this.newOffre.optionsConcernees = this.newOffre.optionsConcernees.filter(v => v !== value);
  }
}

onFieldChange(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const value = checkbox.value as FieldDisponible;

  if (checkbox.checked) {
    this.newOffre.fieldsDisponibles.push(value);
  } else {
    this.newOffre.fieldsDisponibles = this.newOffre.fieldsDisponibles.filter(f => f !== value);
  }
}




  createOffre(): void {
  this.offreService.create(this.newOffre).subscribe({
    next: (offre) => {
      this.offres.push(offre);
      this.loadOffres();   // recharge la liste
      this.annuler();  
    },
    error: (err) => {
      console.error('Erreur lors de l’ajout de l’offre:', err);
    }
  });
}

deleteOffre(id: number): void {
  if (confirm("Voulez-vous vraiment supprimer cette offre ?")) {
    this.offreService.delete(id).subscribe({
      next: () => {
        // Rafraîchir la liste après suppression
        this.offres = this.offres.filter(o => o.id !== id);
      },
      error: (err) => {
        console.error("Erreur lors de la suppression :", err);
        alert("La suppression a échoué.");
      }
    });
  }
}




onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragOver = false;
  if (event.dataTransfer && event.dataTransfer.files) {
    this.handleFiles(event.dataTransfer.files);
  }
}

onFileSelected(event: any) {
  const files: FileList = event.target.files;
  this.handleFiles(files);
}

handleFiles(files: FileList) {
  const newPreviews: string[] = [];
  const newCompressedFiles: File[] = [];

  const promises = Array.from(files).map((file) => {
    return new Promise<void>((resolve, reject) => {
      if (!file.type.startsWith('image/')) return resolve();

      new ImageCompressor(file, {
        quality: 0.6,
        success: (compressedBlob) => {
          const compressedFile = new File(
            [compressedBlob],
            file.name,
            { type: file.type, lastModified: Date.now() }
          );

          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            newPreviews.push(base64);
            newCompressedFiles.push(compressedFile);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(compressedFile);
        },
        error: reject,
      });
    });
  });

  Promise.all(promises).then(() => {
    if (this.modeFormulaire === 'modification') {
      // On écrase les anciennes images uniquement
      this.imagePreviews = [...newPreviews];
      this.selectedImages = [...newCompressedFiles];
    } else {
      // En ajout, on ajoute simplement
      this.imagePreviews.push(...newPreviews);
      this.selectedImages.push(...newCompressedFiles);
    }

    this.newOffre.imageUrls = this.imagePreviews;
  });
}



ouvrirAjout(): void {
  this.newOffre = this.getOffreVide();
  this.modeFormulaire = 'ajout';
  this.imagePreviews = [];
}
ouvrirModification(offre: any): void {
  this.newOffre = { ...offre }; // clone pour ne pas modifier l'objet original
  this.modeFormulaire = 'modification';
  this.offreToEdit = offre;
  this.imagePreviews = [...offre.imageUrls]; // adapte selon ton format d'images
}
annuler(): void {
  this.newOffre = this.getOffreVide();
  this.modeFormulaire = 'affichage';
  this.imagePreviews = [];
  this.offreToEdit = null;
}
updateOffre(): void {
  if (!this.offreToEdit) return;

  const updated = {
    ...this.newOffre,
    id: this.offreToEdit.id,
    imageUrls: this.imagePreviews
  };

  this.offreService.update(updated).subscribe({
    next: () => {
      this.annuler();
      this.loadOffres(); // recharge la liste
    },
    error: (err) => console.error('Erreur de mise à jour', err)
  });
}
getOffreVide(): any {
  return {
    titre: '',
    universite: '',
    type: '',
    description: '',
    optionsConcernees: [],
    fieldsDisponibles: [],
    pays: '',
    dateDebut: '',
    dateFin: '',
    nombrePlaces: 0,
    active: true,
    imageUrls: []
  };
}






}
