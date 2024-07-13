import { Component, Output } from '@angular/core';
import { ParkListServiceService } from './park-list-service.service';
import { ParkList } from './park-list';
import { ParkReserve } from './park-reserves';
import { ReserveResult } from './reserve-result';
import { Parks } from '../parks';
import { concatMap } from 'rxjs';
import { ParkObject } from './park-object';
import { ParkListDetails } from '../park-list-details/park-list-details';
import { Router } from '@angular/router';
import { AdminService } from '../../back-office/admin.service';
import { AbrirCancelaResponse } from '../../back-office/abrir-cancela-response';
import { Token } from '@angular/compiler';
import { TokenServiceService } from '../../shared/token/token-service.service';

@Component({
  selector: 'app-park-list',
  templateUrl: './park-list.component.html',
  styleUrl: './park-list.component.css'
})
export class ParkListComponent {

  public parkList!: ParkList
  public parks: Parks[] = []
  public isHandicap!: Boolean
  public isLoading: boolean = true
  

  constructor(private parkListService: ParkListServiceService, private router: Router, private adminService: AdminService,
    private tokenService: TokenServiceService
  ){

    this.parkListService.getAllReservedParks().subscribe((parkList: ParkList) => {
      this.isHandicap = parkList.result.isHandicap
      console.log("isHANDICAP = ", this.isHandicap)
    })
    
    //this.isHandicap = tokenService.returnIsHandicap()

    this.parkListService.getAllReservedParks().subscribe((parkList: ParkList) => {
      console.log("Reserved Park List = ", parkList)
      console.log("Reserves = ", parkList.result)
      this.parkList = parkList//.result.reserves
      
      this.parkList.result.parkName = []
      //Get the specific Park using the get_park api
      for(let i = 0; i < parkList.result.reserves.length; i++){
        console.log("PARK ID = ", parkList.result.reserves[i].parkID)
        
        this.parkListService.getSpecificPark(parkList.result.reserves[i].parkID).subscribe((park: any) => {
          
          this.parks.push(park)

          this.parkList.result.parkName.push(park.result.name) 

          //Checks if the List has already been Fufilled
          if(this.parkList.result.parkName.length == parkList.result.reserves.length){
            this.isLoading = false
          }
        })
      }
      this.parkList.result.park = this.parks
    })
  }

  checkDetails(index: number){
    console.log("Detalhes = ", this.parkList.result)

    const ID = this.parkList.result.ID
    const address = this.parkList.result.address
    const firstName = this.parkList.result.firstName
    const lastName = this.parkList.result.lastName
    const park = this.parkList.result.park[index]
    const phoneNumber = this.parkList.result.phoneNumber
    const reserve = this.parkList.result.reserves[index]
    const vehicle = this.parkList.result.vehicle
    
    const parkListDetails = new ParkListDetails(ID, address, firstName, lastName, park, phoneNumber, reserve, vehicle)
    
    console.log("Park List Details = ", parkListDetails)
    this.router.navigateByUrl("/park-list-details", {state: parkListDetails})
  }

  abrirCancela(){
    this.adminService.abrirCancela().subscribe((abrirCancelaResponse: AbrirCancelaResponse) => {
      /*if(abrirCancelaResponse.result.isOpen == true){
        //Shows Alert From the Cancel Open
      }*/
    })
  }

}
