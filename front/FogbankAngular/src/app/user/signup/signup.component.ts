import { Component } from '@angular/core';
import {AuthServiceService} from "../../service/user/auth-service.service";
import {SignUpRequest} from "../../models/SignUpRequest";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {


  signUpRequest: SignUpRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    rememberMe: false
  };




  constructor(private http: HttpClient, private authService: AuthServiceService,private router:Router) { }

  signup() {
    this.authService.signup(this.signUpRequest).subscribe(
      (response) => {
        console.log('Inscription réussie :', response);
        this.router.navigateByUrl('/login');

      },
      (error) => {
        console.error('Erreur lors de linscription :', error);
      }
    );
  }


}
