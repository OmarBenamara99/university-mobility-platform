import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
   private apiUrl = 'http://localhost:8087/api/v1/admin';

  constructor(private http: HttpClient) { }

  // Send a message to common group (keep for backward compatibility)
  sendMessageToCommonGroup(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/message/send/common`, message).pipe(
      catchError(err => {
        console.error('Error sending message:', err);
        return throwError(err);
      })
    );
  }

  // Get all messages from common group (keep for backward compatibility)
  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`).pipe(
      catchError(err => {
        console.error('Error fetching all messages:', err);
        return throwError(err);
      })
    );
  }

  // NEW: Send message to specific offer group
  sendMessageToOffer(message: Message, offerId: number): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/offer/${offerId}/message/send`, message).pipe(
      catchError(err => {
        console.error('Error sending message to offer:', err);
        return throwError(err);
      })
    );
  }

  // NEW: Get messages for specific offer group
  getOfferMessages(offerId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/offer/${offerId}/messages`).pipe(
      catchError(err => {
        console.error('Error fetching offer messages:', err);
        return throwError(err);
      })
    );
  }
}