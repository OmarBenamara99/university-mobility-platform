import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../shared/user.service";
import { User } from "../../../models/User";
import {AuthServiceService} from "../../../service/user/auth-service.service";

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  originalListUsers: User[] = []; // Stockez la liste originale des utilisateurs
  listUsers: User[] = [];
  searchTerm: string = '';
  userPhotoUrl!: string;


  constructor(private _service: UserService,private authService :AuthServiceService) { }

  ngOnInit(): void {
    this._service.getUsersName().subscribe(users => {
      this.originalListUsers = users; // Initialisez la liste originale
      this.listUsers = users;
    });
  }

  searchUsers(): void {
    console.log('searchUsers() called!');
    console.log('Search term:', this.searchTerm);
    console.log('Original list of users:', this.originalListUsers);
    this.listUsers = this.originalListUsers.filter(user =>
      user.firstname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  exportToCsv(): void {
    const csvData = this.convertToCsv(this.listUsers);
    const currentDate = new Date();
    const fileName = `users_${currentDate.toISOString().slice(0, 10)}.csv`; // Generate file name with current date
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Set the file name to the generated file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  getUserPhoto(userId: number | undefined): string {
    const userPhotoUrl = this.authService.getUserPhotoUrl(userId);

    // Check if userPhotoUrl is valid
    if (userPhotoUrl) {
      // Return userPhotoUrl if it's valid
      return userPhotoUrl;
    } else {
      // Return default image URL if userPhotoUrl is not valid or undefined
      return 'assets/img/instructor/profile-avatar.jpg';
    }
  }







  private convertToCsv(data: User[]): string {
    let csv = ''; // Initial empty CSV string

    // Header row with column names
    csv += 'ID           ;First Name   ;Last Name    ;Email             ;Role      ;Bio      ;Address    ;Mobile Phone\n';

    // Iterate over the user data and convert them into CSV rows
    data.forEach(user => {
      // Escape commas in text fields by surrounding them with double quotes
      const id = this.escapeCsvField(user.id?.toString() ?? '');
      const firstName = this.escapeCsvField(user.firstname);
      const lastName = this.escapeCsvField(user.lastname);
      const email = this.escapeCsvField(user.email);
      const role = this.escapeCsvField(user.role);
      const bio = this.escapeCsvField(user.bio);
      const address = this.escapeCsvField(user.address);
      const mobilePhone = this.escapeCsvField(user.mobilePhone);

      // Concatenate the values with semicolons to form a CSV row with each field in its respective column
      csv += `${id};${firstName};${lastName};${email};${role};${bio};${address};${mobilePhone}\n`;
    });

    return csv; // Return the generated CSV string
  }
  // Méthode pour échapper les virgules dans les champs texte
  // Méthode pour échapper les virgules dans les champs texte
  private escapeCsvField(field?: string): string {
    // Si le champ est défini et contient une virgule, l'entourer de guillemets doubles
    if (field && field.includes(',')) {
      return `"${field}"`;
    }
    return field ?? ''; // Sinon, retourner le champ ou une chaîne vide
  }



  deleteUser(user: User) {
    this._service.deleteUser(user.id).subscribe(() => {
      console.log("Utilisateur supprimé :", user);
      // Actualisez la liste des utilisateurs après la suppression
      this.originalListUsers = this.originalListUsers.filter(u => u.id !== user.id);
      this.listUsers = this.listUsers.filter(u => u.id !== user.id);
    });
  }
}
