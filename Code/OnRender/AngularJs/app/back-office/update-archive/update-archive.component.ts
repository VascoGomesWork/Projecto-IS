import { Component } from '@angular/core';
import { UpdateArchive } from './update-archive';
import { UpdateArquiveService } from './update-arquive.service';
import { ParkListServiceService } from '../../front-office/park-list/park-list-service.service';
import { UpdateArchiveTest } from './update-archive-test';
import { Parks } from '../../front-office/parks';

@Component({
  selector: 'app-update-archive',
  templateUrl: './update-archive.component.html',
  styleUrl: './update-archive.component.css'
})
export class UpdateArchiveComponent {

  parkResult!: Parks
  parkNameList: string[] = []
  cityList: string[] = []
  spotList: string[] = []
  occupiedList: boolean[] = []
  public isLoading: boolean = true

  constructor(private updateArchiveService: UpdateArquiveService, private parkService: ParkListServiceService, 
    private parkListService: ParkListServiceService){
    //Gets the Maitenance Archive Total
    this.parkListService.getParks().subscribe((parkResult: Parks) => {
      
      console.log("Update Archive Result = ", parkResult)
      this.parkResult = parkResult
      for(let i = 0; i < parkResult.result.length; i++){
        

          console.log("TESTE = ", parkResult.result[i])
          
          this.parkNameList.push(parkResult.result[i].name)
            this.cityList.push(parkResult.result[i].city)
            this.spotList.push(parkResult.result[i].spots[0].spotID)
            this.occupiedList.push(parkResult.result[i].spots[0].isOccupied)

           //Checks if the List has already been Fufilled
            if(this.occupiedList.length == parkResult.result.length){
              this.isLoading = false
            } 

          for(let j = 0; j < parkResult.result[i].spots.length; j++){
            //console.log("SPOT DETAILS = ", parkResult.result[i].spots[j].spotID)
            
          }
      }
      
    })
  }

}
