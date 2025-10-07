import { OffreType } from './offre-type.enum';
import { Universite } from './universite.enum';
import { OptionEsprit } from './option-esprit.enum';
import { FieldDisponible } from './fielddispo.enum';
import { Pays } from './pays.enum';
import { Candidature } from './Candidature';

export interface Offre {
    id?: number;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    type: OffreType;
    universite: Universite;
    optionsConcernees: OptionEsprit[];
    fieldsDisponibles: FieldDisponible[];
    pays: Pays;
    
    
    nombrePlaces: number;
    active: boolean;
    imageUrls: string[];

    candidatures?: Candidature[]; // ✅ Add this field
  }
  