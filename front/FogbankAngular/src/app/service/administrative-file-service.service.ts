import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AdministrativeFile } from '../models/administrative-file';
import { FileStatus } from '../models/file-status.enum';
import { PaymentMethod } from '../models/payment-method.enum';

@Injectable({
  providedIn: 'root'
})
export class AdministrativeFileServiceService {

  private apiUrl = 'http://localhost:8087/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Create admin file for a candidature
  createForCandidature(candidatureId: number): Observable<AdministrativeFile> {
    return this.http.post<AdministrativeFile>(
      `${this.apiUrl}/candidature/${candidatureId}/create-admin-file`,
      null
    ).pipe(
      catchError(err => {
        console.error('Error creating admin file:', err);
        return throwError(err);
      })
    );
  }

  // Get admin file for a candidature
  getByCandidature(candidatureId: number): Observable<AdministrativeFile> {
    return this.http.get<AdministrativeFile>(
      `${this.apiUrl}/candidature/${candidatureId}/admin-file`
    ).pipe(
      catchError(err => {
        console.error('Error getting admin file:', err);
        return throwError(err);
      })
    );
  }

  // Update payment method
  updatePaymentMethod(fileId: number, paymentMethod: PaymentMethod): Observable<AdministrativeFile> {
    const params = new HttpParams().set('paymentMethod', paymentMethod);
    
    return this.http.patch<AdministrativeFile>(
      `${this.apiUrl}/admin-file/${fileId}/payment-method`,
      null,
      { params }
    ).pipe(
      catchError(err => {
        console.error('Error updating payment method:', err);
        return throwError(err);
      })
    );
  }

  // Upload payment receipt
  uploadReceipt(fileId: number, receiptFile: File): Observable<AdministrativeFile> {
    const formData = new FormData();
    formData.append('receipt', receiptFile);

    return this.http.post<AdministrativeFile>(
      `${this.apiUrl}/admin-file/${fileId}/upload-receipt`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Error uploading receipt:', err);
        return throwError(err);
      })
    );
  }

  // Upload cheques
  uploadCheques(fileId: number, chequesFile: File): Observable<AdministrativeFile> {
    const formData = new FormData();
    formData.append('cheques', chequesFile);

    return this.http.post<AdministrativeFile>(
      `${this.apiUrl}/admin-file/${fileId}/upload-cheques`,
      formData
    ).pipe(
      catchError(err => {
        console.error('Error uploading cheques:', err);
        return throwError(err);
      })
    );
  }

  // Get all admin files for a user
  getByUserId(userId: number): Observable<AdministrativeFile[]> {
    return this.http.get<AdministrativeFile[]>(
      `${this.apiUrl}/user/${userId}/admin-files`
    ).pipe(
      catchError(err => {
        console.error('Error getting user admin files:', err);
        return throwError(err);
      })
    );
  }

  // Update file status (admin use)
  updateStatus(fileId: number, newStatus: FileStatus): Observable<AdministrativeFile> {
    const params = new HttpParams().set('newStatus', newStatus);
    
    return this.http.patch<AdministrativeFile>(
      `${this.apiUrl}/admin-file/${fileId}/status`,
      null,
      { params }
    ).pipe(
      catchError(err => {
        console.error('Error updating file status:', err);
        return throwError(err);
      })
    );
  }


  getAllAdminFiles(): Observable<AdministrativeFile[]> {
  return this.http.get<AdministrativeFile[]>(
    `${this.apiUrl}/admin-files` // You'll need to create this endpoint
  ).pipe(
    catchError(err => {
      console.error('Error getting all admin files:', err);
      return throwError(err);
    })
  );
}

// Download file
downloadFile(fileId: number, fileType: 'receipt' | 'cheques'): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/admin-file/${fileId}/download-${fileType}`,
    { responseType: 'blob' }
  ).pipe(
    catchError(err => {
      console.error('Error downloading file:', err);
      return throwError(err);
    })
  );
}
}
