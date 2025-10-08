import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Offre } from '../models/offre';
import { OrdreMission } from '../models/OrdreMission';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private addUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/addOffre';
  private updateUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/updateOffre';
  private deleteUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/deleteOffre';
  private showUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/offres';
  private offresWithCandidaturesUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin/with-candidatures';
  private apiUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin';

  constructor(private http: HttpClient) { }

    getAll(): Observable<Offre[]> {
      return this.http.get<Offre[]>(this.showUrl);
    }
  
    create(offre: Offre): Observable<Offre> {
      return this.http.post<Offre>(`${this.addUrl}`, offre);
  }
  
    update(offre: Offre): Observable<Offre> {
      const url = `${this.updateUrl}`;
      return this.http.put<Offre>(url, offre);
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.deleteUrl}/${id}`);
    }

    getAllWithCandidatures(): Observable<Offre[]> {
     return this.http.get<Offre[]>(this.offresWithCandidaturesUrl);
    }

    getOffresWithUserCandidatures(userId: number): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/with-candidatures/user/${userId}`);
    }
    getDiscussionGroupByOffreId(offreId: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/offre/${offreId}/discussion-group`
  ).pipe(
    catchError(err => {
      console.error('Error getting discussion group:', err);
      return throwError(err);
    })
  );
}


getDiscussionGroupByOfferId(offerId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/offer/${offerId}/discussion-group`).pipe(
    catchError(err => {
      console.error('Error getting discussion group:', err);
      return throwError(err);
    })
  );
}


// Add these methods to your OffreService class
getOrdreMission(offerId: number): Observable<OrdreMission> {
  return this.http.get<OrdreMission>(`${this.apiUrl}/offer/${offerId}/ordre-mission`);
}

checkOrdreMissionExists(offerId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/offer/${offerId}/ordre-mission/exists`);
}

getOffreById(offerId: number): Observable<Offre> {
  return this.http.get<Offre>(`${this.apiUrl}/retrieveOffer/${offerId}`).pipe(
    catchError(err => {
      console.error('Error getting offer:', err);
      return throwError(err);
    })
  );
}



}
