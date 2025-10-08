import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobilityProcessService {

  private apiUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Check if student has access to preparation phase
  checkStudentAccess(userId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/user/${userId}/has-mobility-access`
    ).pipe(
      catchError(err => {
        console.error('Error checking mobility access:', err);
        return throwError(err);
      })
    );
  }

  // Get mobility process for current user
  getMobilityProcessByUserId(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/user/${userId}/mobility-process`
    ).pipe(
      catchError(err => {
        console.error('Error getting mobility process:', err);
        return throwError(err);
      })
    );
  }

  getUserMobilityProcess(userId: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/user/${userId}/mobility-process`
  ).pipe(
    catchError(err => {
      console.error('Error getting mobility process:', err);
      return throwError(err);
    })
  );
}

// NEW endpoint (with JOIN FETCH) - Rename to be clear
getUserMobilityProcessWithDetails(userId: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/user/${userId}/mobility-process-details`  // NEW
  ).pipe(
    catchError(err => {
      console.error('Error getting mobility process with details:', err);
      return throwError(err);
    })
  );
}
}
