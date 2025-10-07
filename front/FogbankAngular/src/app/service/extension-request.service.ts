import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ExtensionRequest } from '../models/extension-request';
import { ExtensionStatus } from '../models/extension-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ExtensionRequestService {

  private apiUrl = 'http://localhost:8087/api/v1/admin/extension-requests';

  constructor(private http: HttpClient) { }

  // Student creates extension request
  createExtensionRequest(request: ExtensionRequest, studentId: number, file?: File): Observable<ExtensionRequest> {
    const formData = new FormData();
    
    // Add request data as JSON
    const requestBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('request', requestBlob);
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<ExtensionRequest>(
      `${this.apiUrl}/student/${studentId}`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Error creating extension request:', err);
        throw err;
      })
    );
  }

  // Get student's extension requests
  getStudentExtensionRequests(studentId: number): Observable<ExtensionRequest[]> {
    return this.http.get<ExtensionRequest[]>(
      `${this.apiUrl}/student/${studentId}`
    ).pipe(
      catchError(err => {
        console.error('Error getting student extension requests:', err);
        return of([]);
      })
    );
  }

  // Admin gets all extension requests
  getAllExtensionRequests(): Observable<ExtensionRequest[]> {
    return this.http.get<ExtensionRequest[]>(
      `${this.apiUrl}/admin/all`
    ).pipe(
      catchError(err => {
        console.error('Error getting all extension requests:', err);
        return of([]);
      })
    );
  }

  // Get requests by status
  getExtensionRequestsByStatus(status: ExtensionStatus): Observable<ExtensionRequest[]> {
    return this.http.get<ExtensionRequest[]>(
      `${this.apiUrl}/admin/status/${status}`
    ).pipe(
      catchError(err => {
        console.error('Error getting extension requests by status:', err);
        return of([]);
      })
    );
  }

  // Get single request
  getExtensionRequestById(requestId: number): Observable<ExtensionRequest> {
    return this.http.get<ExtensionRequest>(
      `${this.apiUrl}/${requestId}`
    ).pipe(
      catchError(err => {
        console.error('Error getting extension request:', err);
        throw err;
      })
    );
  }

  // Admin updates request status
  updateRequestStatus(requestId: number, status: ExtensionStatus, adminResponse?: string): Observable<ExtensionRequest> {
    let params = new HttpParams().set('status', status);
    
    if (adminResponse) {
      params = params.set('adminResponse', adminResponse);
    }

    return this.http.patch<ExtensionRequest>(
      `${this.apiUrl}/admin/${requestId}/status`,
      null,
      { params }
    ).pipe(
      catchError(err => {
        console.error('Error updating request status:', err);
        throw err;
      })
    );
  }

  // Download attached file
  downloadRequestFile(requestId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${requestId}/download`,
      { responseType: 'blob' }
    ).pipe(
      catchError(err => {
        console.error('Error downloading request file:', err);
        throw err;
      })
    );
  }

  // Delete extension request
  deleteExtensionRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${requestId}`
    ).pipe(
      catchError(err => {
        console.error('Error deleting extension request:', err);
        throw err;
      })
    );
  }

  // Get status counts for dashboard
  getStatusCounts(): Observable<{ [key in ExtensionStatus]: number }> {
    return this.http.get<{ [key in ExtensionStatus]: number }>(
      `${this.apiUrl}/admin/status-counts`
    ).pipe(
      catchError(err => {
        console.error('Error getting status counts:', err);
        return of({
          [ExtensionStatus.PENDING]: 0,
          [ExtensionStatus.APPROVED]: 0,
          [ExtensionStatus.REJECTED]: 0,
          [ExtensionStatus.UNDER_REVIEW]: 0
        });
      })
    );
  }
}
