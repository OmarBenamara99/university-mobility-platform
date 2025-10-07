
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersUrl="http://localhost:8087/api/v1/admin";
  constructor(private _http:HttpClient) { }

  getUsersName() : Observable<User[]> {
    return this._http.get<User[]>(`${this.usersUrl}/getAllUsers`);
  }

  deleteUser(userId: number | undefined): Observable<void> {
    return this._http.delete<void>(`${this.usersUrl}/delete/${userId}`);
  }


}


