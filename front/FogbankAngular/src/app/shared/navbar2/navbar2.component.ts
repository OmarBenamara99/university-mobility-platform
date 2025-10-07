import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../service/user/token-storage.service";
import {AuthServiceService} from "../../service/user/auth-service.service";

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css']
})
export class Navbar2Component implements OnInit{
  currentUser: any;
  userPhotoUrl!: string;


  constructor(private tokenStorageService: TokenStorageService,private authService : AuthServiceService) {}
  logout(): void {

    console.log('Tokens cleared.');

    this.tokenStorageService.clearTokens();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getUserPhoto();
    console.log('Current User:', this.currentUser);
  }


  getUserPhoto(): void {
    this.authService.getUserPhoto(this.currentUser.id)
      .subscribe((photoBlob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.userPhotoUrl = reader.result as string;
        };
        reader.readAsDataURL(photoBlob);
      });
  }



}
