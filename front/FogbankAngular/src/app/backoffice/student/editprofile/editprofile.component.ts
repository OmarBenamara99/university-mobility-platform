import {Component, OnInit} from '@angular/core';
import {AuthServiceService} from "../../../service/user/auth-service.service";
import {User} from "../../../models/User";
import {Profile} from "../../../models/Profile";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {
  constructor(    private fb: FormBuilder,private authService: AuthServiceService) { }

  currentUser:any;
  userForm!: FormGroup;
  userPhotoUrl!: string;


  public user: User={
    id: this.authService.getCurrentUser().id ,
    email: "",
    firstname: "",
    lastname: "",
    role: "USER",
    bio: "",
    mobilePhone: "",
    address: "",
    username: ""
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
      this.getUserPhoto() ;
      this.userForm.patchValue(user)

      console.log("user: " + this.user)
    })


    this.userForm = this.fb.group({
      id: [this.user.id],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      bio: [''],
      mobilePhone: ['']
    });




  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Convert the file to a blob and store it in the user object
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentUser.photo = new Uint8Array(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  onUploadButtonClick() {
    // Trigger the file input click event to open the file chooser dialog
    document.getElementById('imageUpload')?.click();
  }




  onUpdate() {
    if (this.userForm.valid) {
      this.authService.updateUser(this.userForm.value).subscribe(
        (updatedUser) => {
          // After the user is updated, upload the photo
          this.authService.uploadUserPhoto(this.currentUser.id, this.currentUser.photo).subscribe(
            (response) => {
              console.log('Photo uploaded successfully');
            },
            (error) => {
              console.error('Error uploading photo:', error);
            }
          );

          window.location.reload();


        },
        (error) => {
          console.error('Error updating User:', error);
        }
      );
    } else {
      // Handle form invalid case
    }
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






  updateUser(): void {
    if (this.userForm.valid) {
      this.authService.updateUser(this.userForm.value).subscribe(
        (updatedUser) => {

        },
        (error) => {
          console.error('Error updating User:', error);

        }
      );
    } else {

    }
  }






}
