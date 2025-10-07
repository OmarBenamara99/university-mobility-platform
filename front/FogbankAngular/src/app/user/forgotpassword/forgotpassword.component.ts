import { Component } from '@angular/core';
import {EmailverificationService} from "../../service/user/emailverification.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {

  email: string = '';
  verificationMessage: string = '';
  emailExists: boolean | undefined;


  constructor(private snackBar: MatSnackBar ,private emailVerificationService: EmailverificationService ,private router :Router) { }

  verifyEmail(): void {

    this.emailVerificationService.verifmail(this.email).subscribe(
      response => {
        this.emailExists = response;
        if (this.emailExists) {
          console.log('Email exists');
          this.showNotification('Email exists. Please check your inbox.');
          this.router.navigate(['/otp'], { queryParams: { email: this.email } });

          // Do something if email exists
        } else {
          console.log('Email does not exist');
          this.verificationMessage = 'An error occurred while verifying email.';

        }
      },
      error => {
        console.error('Error verifying email:', error);
        // Handle error
      }
    );


  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }


}
