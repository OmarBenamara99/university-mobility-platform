import {Component, OnInit} from '@angular/core';
import {AuthServiceService} from "../service/user/auth-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements  OnInit {

  email: string ='';

ngOnInit() {

  this.route.queryParams.subscribe(params => {
    this.email = params['email'];
  });

}

  changePasswordForm = {
    password: '',
    repeatpassword: ''
  };
  constructor(private snackBar: MatSnackBar,private authservice: AuthServiceService,private route: ActivatedRoute,private router :Router) { }
  onSubmit() {
    console.log(this.email);
    this.authservice.changePassword(this.email, this.changePasswordForm).subscribe(
      response => console.log(response)

      ,
      error => {
        this.router.navigate(['/login']);
        this.showNotification('Password changed successfully. Please login to continue.');

      }


  );
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }


}
