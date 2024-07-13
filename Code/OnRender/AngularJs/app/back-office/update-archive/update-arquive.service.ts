import { Injectable } from '@angular/core';
import { UpdateArchive } from './update-archive';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateArquiveService {

  private getUpdateArchiveURL = "https://fast-api-parklookup.onrender.com/get_update_archive"

  private updateArchiveList: UpdateArchive[] = []
  private updateArchiveBody = {"ID": "1"}

  constructor(private http: HttpClient, private tokenService: TokenServiceService) { }

  //Get the 3 Parks available for each City
  getUpdateArchive(): Observable<UpdateArchive>{
    
    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<UpdateArchive>(this.getUpdateArchiveURL, this.updateArchiveBody, {headers})
  }
  
}
