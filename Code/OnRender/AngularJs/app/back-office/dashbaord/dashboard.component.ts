import { Component } from '@angular/core';
import { MaintenanceArchive } from '../maintenance-archive/maitenance-archive';
import { UpdateArchive } from '../update-archive/update-archive';
import { ParkList } from '../../front-office/park-list/park-list';
import { MaintenanceArquiveService } from '../maintenance-archive/maintenance-arquive.service';
import { UpdateArquiveService } from '../update-archive/update-arquive.service';
import { ParkListServiceService } from '../../front-office/park-list/park-list-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  maintenanceArchiveTotal!: number
  updateArchiveTotal!: number
  parksTotal!: number
  reservesTotal!: number

  constructor(private maintenanceArchiveService: MaintenanceArquiveService, private updateArchiveService: UpdateArquiveService){

    //Gets the Maitenance Archive Total
    this.maintenanceArchiveService.getMaintenanceArchive().subscribe((maintenanceArchive: MaintenanceArchive) => {
      this.maintenanceArchiveTotal = maintenanceArchive.result.length
      console.log("Maitenance Archive Total = ", this.maintenanceArchiveTotal)
    })
    //Gets the Update Archive Total
    this.updateArchiveService.getUpdateArchive().subscribe((updateArchive: UpdateArchive) => {
      this.updateArchiveTotal = updateArchive.result.length
      console.log("Update Archive Total = ", this.updateArchiveTotal)
    })
  }
}
