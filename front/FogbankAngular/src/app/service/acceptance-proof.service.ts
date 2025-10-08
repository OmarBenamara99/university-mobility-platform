import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AcceptanceProof } from '../models/acceptance-proof';
import { ProofStatus } from '../models/proof-status.enum';

@Injectable({
  providedIn: 'root'
})
export class AcceptanceProofService {

  private apiUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Create acceptance proof for a candidature
  createForCandidature(candidatureId: number): Observable<AcceptanceProof> {
    return this.http.post<AcceptanceProof>(
      `${this.apiUrl}/candidature/${candidatureId}/create-acceptance-proof`,
      null
    ).pipe(
      catchError(err => {
        console.error('Error creating acceptance proof:', err);
        return throwError(err);
      })
    );
  }

  // Get acceptance proof for a candidature
  getByCandidature(candidatureId: number): Observable<AcceptanceProof> {
    return this.http.get<AcceptanceProof>(
      `${this.apiUrl}/candidature/${candidatureId}/acceptance-proof`
    ).pipe(
      catchError(err => {
        console.error('Error getting acceptance proof:', err);
        return throwError(err);
      })
    );
  }

  // Upload acceptance document
  uploadDocument(proofId: number, documentFile: File): Observable<AcceptanceProof> {
    const formData = new FormData();
    formData.append('document', documentFile);

    return this.http.post<AcceptanceProof>(
      `${this.apiUrl}/acceptance-proof/${proofId}/upload-document`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Error uploading acceptance document:', err);
        return throwError(err);
      })
    );
  }

  // Get all acceptance proofs for a user
  getByUserId(userId: number): Observable<AcceptanceProof[]> {
    return this.http.get<AcceptanceProof[]>(
      `${this.apiUrl}/user/${userId}/acceptance-proofs`
    ).pipe(
      catchError(err => {
        console.error('Error getting user acceptance proofs:', err);
        return throwError(err);
      })
    );
  }

  // Update proof status (admin use)
  updateStatus(proofId: number, newStatus: ProofStatus): Observable<AcceptanceProof> {
    const params = new HttpParams().set('newStatus', newStatus);
    
    return this.http.patch<AcceptanceProof>(
      `${this.apiUrl}/acceptance-proof/${proofId}/status`,
      null,
      { params }
    ).pipe(
      catchError(err => {
        console.error('Error updating proof status:', err);
        return throwError(err);
      })
    );
  }

  // Get ALL acceptance proofs (for admin dashboard)
getAllAdminProofs(): Observable<AcceptanceProof[]> {
  return this.http.get<AcceptanceProof[]>(
    `${this.apiUrl}/acceptance-proofs` // You'll need to create this endpoint
  ).pipe(
    catchError(err => {
      console.error('Error getting all acceptance proofs:', err);
      return throwError(err);
    })
  );
}

// Download document
downloadDocument(proofId: number): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/acceptance-proof/${proofId}/download-document`,
    { responseType: 'blob' }
  ).pipe(
    catchError(err => {
      console.error('Error downloading document:', err);
      return throwError(err);
    })
  );
}
}
