import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SigninRequest } from 'src/app/models/SigninRequest';
import { AuthServiceService } from 'src/app/service/user/auth-service.service';
import { TokenStorageService } from 'src/app/service/user/token-storage.service';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css']
})
export class LoginadminComponent {
  currentUser: any;
  
  
  
  
  
    signinRequest: SigninRequest = {
      email: '',
      password: ''
    };
  
    constructor(private router :Router, private authService: AuthServiceService , private tokenStorageService : TokenStorageService) { }
  
    signin() {
      this.authService.signin(this.signinRequest).subscribe(
        (response) => {
          console.log('Connexion réussie :', response);
          this.authService.handleAuthentication(response);
          console.log("test",this.tokenStorageService.getAccessToken() );
      this.currentUser=this.authService.getCurrentUser()
          switch (true)
          {
            case (this.currentUser.role=='USER'):
              console.log("USER");
              this.router.navigateByUrl('/admin/users');
  
              break;
            case (this.currentUser.role=="ADMIN")  :
              console.log("ADMIN") ;
              this.router.navigateByUrl('/admin/users');
  
              break;
            default:
              console.log("failed")  ;
          }
  
  
  
        },
        (error) => {
          console.error('Erreur lors de la connexion :', error);
        }
      );
    }

}
