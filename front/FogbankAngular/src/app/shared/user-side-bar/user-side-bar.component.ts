import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/user/auth-service.service';
import { TokenStorageService } from 'src/app/service/user/token-storage.service';

@Component({
  selector: 'app-user-side-bar',
  templateUrl: './user-side-bar.component.html',
  styleUrls: ['./user-side-bar.component.css'],
})
export class UserSideBarComponent implements OnInit {
  @Input() buttonName?: string;
  @Input() buttonLink?: string;
  currentUser: any;
  userPhotoUrl!: string;
  idUser!: number;
  constructor(
    protected router: Router,
    private tokenStorageService: TokenStorageService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.getUserPhoto();
    console.log('Current User:', this.currentUser);
  }

  public afficherProfile() {
    this.idUser = this.authService.getCurrentUser().id;
    this.router.navigate(['/admin/edit'], { queryParams: { id: this.idUser } });
    setTimeout(function () {
      window.location.reload();
    }, 1);
  }

  public logOut(): void {
    console.log('logout');
    this.tokenStorageService.clearTokens();
    this.router.navigateByUrl('/login');
  }

  getUserPhoto(): void {
    this.authService
      .getUserPhoto(this.currentUser.id)
      .subscribe((photoBlob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.userPhotoUrl = reader.result as string;
        };
        reader.readAsDataURL(photoBlob);
      });
  }
}
