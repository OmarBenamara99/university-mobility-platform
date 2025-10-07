import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpRequest } from 'src/app/models/SignUpRequest';
import { AuthServiceService } from 'src/app/service/user/auth-service.service';

@Component({
  selector: 'app-signupadmin',
  templateUrl: './signupadmin.component.html',
  styleUrls: ['./signupadmin.component.css']
})
export class SignupadminComponent {
  signUpRequest: SignUpRequest = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      rememberMe: false
    };
  
  
  
  
    constructor(private http: HttpClient, private authService: AuthServiceService,private router:Router) { }
  
    signup() {
      this.authService.signupadmin(this.signUpRequest).subscribe(
        (response) => {
          console.log('Inscription réussie :', response);
          this.router.navigateByUrl('/loginadmin');
  
        },
        (error) => {
          console.error('Erreur lors de linscription :', error);
        }
      );
    }

}
