import { Component } from '@angular/core';
import { MaintenanceArquiveService } from './maintenance-arquive.service';
import { MaintenanceArchive } from './maitenance-archive';
import { MaintenanceArchiveResult } from './maitenance-archive-result';
import { ParkListServiceService } from '../../front-office/park-list/park-list-service.service';
import { ParkListDetails } from '../../front-office/park-list-details/park-list-details';
import { Park } from '../../front-office/park-list-details/park';
import { Parks } from '../../front-office/parks';

@Component({
  selector: 'app-maintenance-archive',
  templateUrl: './maintenance-archive.component.html',
  styleUrl: './maintenance-archive.component.css'
})
export class MaintenanceArchiveComponent {

  maintenanceArchiveResult!: MaintenanceArchive
  parkNameList: string[] = []
  cityList: string[] = []
  public isLoading: boolean = true

  constructor(private maintenanceArchiveService: MaintenanceArquiveService, private parkService: ParkListServiceService){
    //Gets the Maitenance Archive Total
    this.maintenanceArchiveService.getMaintenanceArchive().subscribe((maintenanceArchiveResult: MaintenanceArchive) => {
      this.maintenanceArchiveResult = maintenanceArchiveResult
      console.log("Maitenance Archive Result = ", this.maintenanceArchiveResult)

      for(let i = 0; i < maintenanceArchiveResult.result.length; i++){
        this.parkService.getSpecificPark(maintenanceArchiveResult.result[i].parkID).subscribe((park: any) => {
          
          this.parkNameList.push(park.result.name)
          this.cityList.push(park.result.city)

          //Checks if the List has already been Fufilled
          if(this.parkNameList.length == maintenanceArchiveResult.result.length){
            this.isLoading = false
          }

        })
      }
      
    })
  }

}
