import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailverificationService {


  private apiUrl = ' http://localhost:8087/forgetpassword/verifyMail/';


  constructor(private http: HttpClient) {}

  verifmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}${email}`, {});
  }

  verifyEmail(email: string): Observable<string> {

    // console.log(email);

    return this.http.post<string>(`${this.apiUrl}${email}`, {});


  }
}
