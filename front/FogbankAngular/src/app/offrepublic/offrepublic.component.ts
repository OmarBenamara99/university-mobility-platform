import { Component, OnInit } from '@angular/core';
import { OffreService } from '../service/offre.service';
import { Offre } from '../models/offre';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-offrepublic',
  templateUrl: './offrepublic.component.html',
  styleUrls: ['./offrepublic.component.css']
})
export class OffrepublicComponent implements OnInit{
  offres: Offre[] = [];
  constructor(private offreService: OffreService, private lightbox: Lightbox) {}

  ngOnInit(): void {
    this.offreService.getAll().subscribe({
      next: (data) => this.offres = data,
      error: (err) => console.error('Erreur chargement offres:', err)
    });
  }

  openLightbox(offre: any): void {
  if (!offre.imageUrls || !offre.imageUrls.length) {
    console.warn('Aucune image trouvée');
    return;
  }

  const album = offre.imageUrls.map((url: string) => ({
    src: url,
    caption: offre.titre || '',
    thumb: url
  }));

  console.log('Album lightbox:', album); // 🔍 pour vérifier que tu as plusieurs images

  this.lightbox.open(album, 0); // ouvre à partir de la première image
}

openLightboxTest() {
  const album = [
    { src: 'assets/img/china.jpg', caption: 'china', thumb: 'assets/img/china.jpg' },
    { src: 'assets/img/tunisia.jpg', caption: 'tunisia', thumb: 'assets/img/tunisia.jpg' }
  ];
  this.lightbox.open(album, 0);
}


  

}
