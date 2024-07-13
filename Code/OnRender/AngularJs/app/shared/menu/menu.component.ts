import { Component } from '@angular/core';
import { TokenServiceService } from '../token/token-service.service';
import { Router } from '@angular/router';
import { ParkListServiceService } from '../../front-office/park-list/park-list-service.service';
import { ParkList } from '../../front-office/park-list/park-list';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  public isHandicap!: Boolean
  public userEmail!: string | null
  constructor(private tokenService: TokenServiceService, private router: Router, private parkListService: ParkListServiceService){
    this.userEmail = this.tokenService.returnUserEmail()
    //this.isHandicap = this.tokenService.returnIsHandicap()

    this.parkListService.getAllReservedParks().subscribe((parkList: ParkList) => {
      console.log("TESTE = ", parkList)
      this.isHandicap = parkList.result.isHandicap
      console.log("isHANDICAP = ", this.isHandicap)
      console.log("GANDA TESTE FDS")
    })

    console.log("IS HANDICAP MENU = ", this.isHandicap)
  }

  logout(){
    this.tokenService.removeUserEmail()
    this.tokenService.removeIsHandicap()
    this.router.navigateByUrl("/login")
  }

}
