import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError,map } from 'rxjs';
import { EquivalenceDocument } from '../models/EquivalenceDocument';
import { ExamChoice } from '../models/ExamChoice';

@Injectable({
  providedIn: 'root'
})
export class EquivalenceService {

  private apiUrl = 'http://localhost:8087/api/v1/admin/equivalence';

  constructor(private http: HttpClient) { }

  // Document methods
  uploadDocument(file: File, offerId: number, originalFileName: string): Observable<EquivalenceDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('originalFileName', originalFileName);

    return this.http.post<EquivalenceDocument>(
      `${this.apiUrl}/document/offer/${offerId}`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Error uploading document:', err);
        return throwError(err);
      })
    );
  }
  // Student transcript upload
  uploadStudentTranscript(file: File, studentId: number, offerId: number, originalFileName: string): Observable<EquivalenceDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('originalFileName', originalFileName);

    return this.http.post<EquivalenceDocument>(
      `${this.apiUrl}/document/student/${studentId}/offer/${offerId}`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Error uploading student transcript:', err);
        return throwError(err);
      })
    );
  }

  getDocumentsByOffer(offerId: number): Observable<EquivalenceDocument[]> {
    return this.http.get<EquivalenceDocument[]>(
      `${this.apiUrl}/document/offer/${offerId}`
    ).pipe(
      catchError(err => {
        console.error('Error getting documents:', err);
        return throwError(err);
      })
    );
  }
  // Get student's transcripts
  getStudentTranscripts(studentId: number): Observable<EquivalenceDocument[]> {
    return this.http.get<EquivalenceDocument[]>(
      `${this.apiUrl}/student/${studentId}/transcripts`
    ).pipe(
      catchError(err => {
        console.error('Error getting student transcripts:', err);
        return of([]);
      })
    );
  }
  // Admin gets all student transcripts
  // Get all student transcripts (only grade transcripts)
getAllStudentTranscripts(): Observable<EquivalenceDocument[]> {
  return this.http.get<EquivalenceDocument[]>(
    `${this.apiUrl}/admin/transcripts`
  ).pipe(
    map(transcripts => transcripts.filter(t => t.type === 'STUDENT_GRADE_TRANSCRIPT')),
    catchError(err => {
      console.error('Error getting all transcripts:', err);
      return of([]);
    })
  );
}
  // Get transcripts for specific offer
  getStudentTranscriptsByOffer(offerId: number): Observable<EquivalenceDocument[]> {
    return this.http.get<EquivalenceDocument[]>(
      `${this.apiUrl}/admin/offer/${offerId}/transcripts`
    ).pipe(
      catchError(err => {
        console.error('Error getting offer transcripts:', err);
        return of([]);
      })
    );
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/document/${documentId}/download`,
      { responseType: 'blob' }
    ).pipe(
      catchError(err => {
        console.error('Error downloading document:', err);
        return throwError(err);
      })
    );
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/document/${documentId}`
    ).pipe(
      catchError(err => {
        console.error('Error deleting document:', err);
        return throwError(err);
      })
    );
  }

  // Exam choice methods
  getOfferExamChoices(offerId: number): Observable<ExamChoice[]> {
    return this.http.get<ExamChoice[]>(
      `${this.apiUrl}/choice/offer/${offerId}`
    ).pipe(
      catchError(err => {
        console.error('Error getting exam choices:', err);
        return of([]);
      })
    );
  }

  submitExamChoice(examChoice: ExamChoice, studentId: number, offerId: number): Observable<ExamChoice> {
    return this.http.post<ExamChoice>(
      `${this.apiUrl}/choice/student/${studentId}/offer/${offerId}`,
      examChoice
    ).pipe(
      catchError(err => {
        console.error('Error submitting exam choice:', err);
        return throwError(err);
      })
    );
  }

getAllExamChoices(): Observable<ExamChoice[]> {
    return this.http.get<ExamChoice[]>(
      `${this.apiUrl}/choice/all`
    ).pipe(
      catchError(err => {
        console.error('Error getting all exam choices:', err);
        return of([]);
      })
    );
  }
}
