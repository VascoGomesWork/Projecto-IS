import { Injectable } from '@angular/core';
import { MaintenanceArchive } from './maitenance-archive';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { Observable } from 'rxjs';
import { MaintenanceArchiveResult } from './maitenance-archive-result';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceArquiveService {

  private getMaintenanceArchiveURL = "https://fast-api-parklookup.onrender.com/get_maintenance_archive"

  private maintenanceArchiveList: MaintenanceArchiveResult[] = []
  private maintenanceArchiveBody = {"ID": "1"}

  constructor(private http: HttpClient, private tokenService: TokenServiceService) { }

  //Get the 3 Parks available for each City
  getMaintenanceArchive(): Observable<MaintenanceArchive>{
    
    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<MaintenanceArchive>(this.getMaintenanceArchiveURL, this.maintenanceArchiveBody, {headers})
  }

  
}
