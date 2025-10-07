import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Reclamation } from '../models/Reclamation';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8087/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Student submits a reclamation
  submitReclamation(reclamation: Reclamation, studentId: number): Observable<Reclamation> {
    return this.http.post<Reclamation>(
      `${this.apiUrl}/student/${studentId}`,
      reclamation
    ).pipe(
      catchError(err => {
        console.error('Error submitting reclamation:', err);
        return throwError(err);
      })
    );
  }

  // Get student's reclamations
  getStudentReclamations(studentId: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(
      `${this.apiUrl}/student/${studentId}`
    ).pipe(
      catchError(err => {
        console.error('Error getting student reclamations:', err);
        return throwError(err);
      })
    );
  }

  // Admin gets unresolved reclamations
  getUnresolvedReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(
      `${this.apiUrl}/admin/unresolved`
    ).pipe(
      catchError(err => {
        console.error('Error getting unresolved reclamations:', err);
        return throwError(err);
      })
    );
  }

  // Admin gets resolved reclamations
  getResolvedReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(
      `${this.apiUrl}/admin/resolved`
    ).pipe(
      catchError(err => {
        console.error('Error getting resolved reclamations:', err);
        return throwError(err);
      })
    );
  }

  // Admin responds to a reclamation
  respondToReclamation(reclamationId: number, response: string): Observable<Reclamation> {
    return this.http.post<Reclamation>(
      `${this.apiUrl}/admin/${reclamationId}/respond?response=${encodeURIComponent(response)}`,
      {}
    ).pipe(
      catchError(err => {
        console.error('Error responding to reclamation:', err);
        return throwError(err);
      })
    );
  }

  // Get count of unresolved reclamations
  getUnresolvedCount(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/admin/unresolved-count`
    ).pipe(
      catchError(err => {
        console.error('Error getting unresolved count:', err);
        return throwError(err);
      })
    );
  }
}
