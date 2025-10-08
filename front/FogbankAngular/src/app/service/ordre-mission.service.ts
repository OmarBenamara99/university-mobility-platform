import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { OrdreMission } from '../models/OrdreMission';

@Injectable({
  providedIn: 'root'
})
export class OrdreMissionService {

  private apiUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Upload Ordre de Mission for an offer
  uploadOrdreMission(offerId: number, file: File): Observable<OrdreMission> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<OrdreMission>(
      `${this.apiUrl}/offer/${offerId}/ordre-mission/upload`, 
      formData
    ).pipe(
      catchError(err => {
        console.error('Error uploading ordre mission:', err);
        return throwError(err);
      })
    );
  }

  // Get Ordre de Mission info for an offer
  getOrdreMissionByOfferId(offerId: number): Observable<OrdreMission> {
    return this.http.get<OrdreMission>(
      `${this.apiUrl}/offer/${offerId}/ordre-mission`
    ).pipe(
      catchError(err => {
        console.error('Error getting ordre mission:', err);
        return throwError(err);
      })
    );
  }

  // Download Ordre de Mission file
  downloadOrdreMission(offerId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/offer/${offerId}/ordre-mission/download`,
      { responseType: 'blob' }
    ).pipe(
      catchError(err => {
        console.error('Error downloading ordre mission:', err);
        return throwError(err);
      })
    );
  }

  // Check if Ordre de Mission exists for an offer
  checkOrdreMissionExists(offerId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/offer/${offerId}/ordre-mission/exists`
    ).pipe(
      catchError(err => {
        console.error('Error checking ordre mission existence:', err);
        return throwError(err);
      })
    );
  }
}
