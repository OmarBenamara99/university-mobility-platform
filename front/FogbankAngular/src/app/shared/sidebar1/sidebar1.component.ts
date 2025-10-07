import { Component } from '@angular/core';
import {TokenStorageService} from "../../service/user/token-storage.service";

@Component({
  selector: 'app-sidebar1',
  templateUrl: './sidebar1.component.html',
  styleUrls: ['./sidebar1.component.css']
})
export class Sidebar1Component {
  constructor(private tokenStorageService: TokenStorageService) {}
  logout(): void {
    console.log('Tokens cleared.');

    this.tokenStorageService.clearTokens();
  }

}
