import { Component } from '@angular/core';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent {

  public userEmail!: string | null
  constructor(private tokenService: TokenServiceService, private router: Router){
    this.userEmail = this.tokenService.returnUserEmail()
  }

  logout(){
    this.tokenService.removeUserEmail()
    //this.tokenService.removeIsHandicap()
    this.router.navigateByUrl("/login")
  }

}
