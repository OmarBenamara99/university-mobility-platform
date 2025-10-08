import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { FeedbackSubmission, Feedback } from '../models/Feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Submit feedback for an offer
  submitFeedback(feedback: FeedbackSubmission, studentId: number, offerId: number): Observable<Feedback> {
    return this.http.post<Feedback>(
      `${this.apiUrl}/offer/${offerId}/feedback?studentId=${studentId}`,
      feedback
    ).pipe(
      catchError(err => {
        console.error('Error submitting feedback:', err);
        return throwError(err);
      })
    );
  }

  // Check if student already submitted feedback for an offer
  hasSubmittedFeedback(studentId: number, offerId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/offer/${offerId}/feedback/student/${studentId}/exists`
    ).pipe(
      catchError(err => {
        console.error('Error checking feedback submission:', err);
        return throwError(err);
      })
    );
  }

  // Get student's feedback for an offer
  getStudentFeedback(studentId: number, offerId: number): Observable<Feedback> {
    return this.http.get<Feedback>(
      `${this.apiUrl}/offer/${offerId}/feedback/student/${studentId}`
    ).pipe(
      catchError(err => {
        console.error('Error getting student feedback:', err);
        return throwError(err);
      })
    );
  }

  // Get all feedbacks by student
  getStudentFeedbacks(studentId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.apiUrl}/student/${studentId}/feedbacks`
    ).pipe(
      catchError(err => {
        console.error('Error getting student feedbacks:', err);
        return throwError(err);
      })
    );
  }



  // Get overall statistics for admin dashboard
getOverallFeedbackStatistics(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/statistics/overall`
  ).pipe(
    catchError(err => {
      console.error('Error getting overall statistics:', err);
      return throwError(err);
    })
  );
}

// Get statistics for all offers (comparison charts)
getStatisticsForAllOffers(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/statistics/all-offers`
  ).pipe(
    catchError(err => {
      console.error('Error getting all offers statistics:', err);
      return throwError(err);
    })
  );
}

// Get all feedbacks with pagination (admin view)
getAllFeedbacks(page: number = 0, size: number = 10): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/feedbacks?page=${page}&size=${size}`
  ).pipe(
    catchError(err => {
      console.error('Error getting all feedbacks:', err);
      return throwError(err);
    })
  );
}

// Get feedbacks for a specific offer
getFeedbacksByOffer(offerId: number): Observable<Feedback[]> {
  return this.http.get<Feedback[]>(
    `${this.apiUrl}/offer/${offerId}/feedbacks`
  ).pipe(
    catchError(err => {
      console.error('Error getting feedbacks by offer:', err);
      return throwError(err);
    })
  );
}

// Get all feedbacks with relationships (for admin)
getAllFeedbacksAdmin(page: number = 0, size: number = 10): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/feedback/all-with-relationships?page=${page}&size=${size}`
  ).pipe(
    catchError(err => {
      console.error('Error getting all feedbacks with relationships:', err);
      return throwError(err);
    })
  );
}
}
