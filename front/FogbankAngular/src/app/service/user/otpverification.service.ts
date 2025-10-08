import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OtpverificationService {


  private baseUrl = 'https://university-mobility-platform.onrender.com/forgetpassword'; // Replace with your Spring Boot server URL

  constructor(private http: HttpClient) { }

  verifyOtp(otp: number, email: string): Observable<string> {
    console.log("allo",otp);
    return this.http.post<string>(`${this.baseUrl}/verifyOtp/${otp}/${email}`, {});
  }



}
