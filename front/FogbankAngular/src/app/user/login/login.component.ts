import {Component} from "@angular/core";
import {SigninRequest} from "../../models/SigninRequest";
import {AuthServiceService} from "../../service/user/auth-service.service";
import {TokenStorageService} from "../../service/user/token-storage.service";
import {Router} from "@angular/router";

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
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
            this.router.navigateByUrl('/student/tb');

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
