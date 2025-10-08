import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Offre } from '../models/offre';
import { Candidature } from '../models/Candidature';
import { ScoreUpdateDto } from '../models/ScoreUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {

  private addUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/addCandidature';
  private updateUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/updateCandidature';
  private deleteUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/deleteCandidature';
  private showUrl  = 'https://university-mobility-platform.onrender.com/api/v1/admin/candidatures';
  private scoresUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin/update-scores';
  private apiUrl = 'https://university-mobility-platform.onrender.com/api/v1/admin';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Candidature[]> {
      return this.http.get<Candidature[]>(this.showUrl);
    }
  
    create(candidature: Candidature): Observable<Candidature> {
      return this.http.post<Candidature>(`${this.addUrl}`, candidature);
  }
  
    update(candidature: Candidature): Observable<Candidature> {
      const url = `${this.updateUrl}`;
      return this.http.put<Candidature>(url, candidature);
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.deleteUrl}/${id}`);
    }

    getCandidaturesByUserId(userId: number): Observable<Candidature[]> {
  return this.http.get<Candidature[]>(`https://university-mobility-platform.onrender.com/api/v1/admin/user/${userId}/candidatures`);
}

uploadFiles(
  candidatureId: number, 
  cvFile: File, 
  lettreMotivationFile?: File, 
  autreDocsFile?: File
): Observable<void> {
  const formData = new FormData();
  formData.append('cv', cvFile);
  if (lettreMotivationFile) formData.append('lettreMotivation', lettreMotivationFile);
  if (autreDocsFile) formData.append('autreDocs', autreDocsFile);

  return this.http.post<void>(
    `https://university-mobility-platform.onrender.com/api/v1/admin/${candidatureId}/files`,
    formData
  );
}

updateScores(updates: ScoreUpdateDto[]): Observable<void> {
  console.log('Sending updates:', updates); // Debug
  return this.http.patch<void>(
    `${this.apiUrl}/update-scores`, 
    updates
  ).pipe(
    tap(() => console.log('Update successful')),
    catchError(err => {
      console.error('Update error:', err);
      return throwError(err);
    })
  );
}


// New method for "Non" choice (delete all)
  deleteAllUserCandidatures(userId: number): Observable<void> {
    return this.http.delete<void>(
      `https://university-mobility-platform.onrender.com/api/v1/admin/${userId}/all`
    ).pipe(
      catchError(err => {
        console.error('Error deleting all candidatures:', err);
        return throwError(err);
      })
    );
  }

  // New method for "Oui" choice (keep one)
  confirmSingleCandidature(userId: number, candidatureId: number): Observable<void> {
    return this.http.post<void>(
      `https://university-mobility-platform.onrender.com/api/v1/admin/${userId}/confirm/${candidatureId}`,
      null  // No request body needed
    ).pipe(
      catchError(err => {
        console.error('Error confirming candidature:', err);
        return throwError(err);
      })
    );
  }

}
