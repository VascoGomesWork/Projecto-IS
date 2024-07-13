import { Injectable } from '@angular/core';
import { ParkList } from './park-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { Observable } from 'rxjs';
import { Parks } from '../parks';

@Injectable({
  providedIn: 'root'
})
export class ParkListServiceService {

  private getAllParksReservedURL = "https://fast-api-parklookup.onrender.com/get_user"
  private getSpecificParkURL = "https://fast-api-parklookup.onrender.com/get_park"
  private getParksURL = "https://fast-api-parklookup.onrender.com/get_parks"

  private parkList: ParkList[] = []
  private parkDataBody = {"ID": "1"}

  constructor(private http: HttpClient, private tokenService: TokenServiceService) { }

  //Get the 3 Parks available for each City
  getAllReservedParks(): Observable<ParkList>{
    
    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });


    this.parkDataBody = {"ID": this.tokenService.returnUserEmail()+""}
  
    return this.http.post<ParkList>(this.getAllParksReservedURL, this.parkDataBody, {headers})
  }

  getSpecificPark(parkID: string): Observable<Parks>{

    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });


    this.parkDataBody = {"ID": parkID}
  
    return this.http.post<Parks>(this.getSpecificParkURL, this.parkDataBody, {headers})
  }

  getParks(): Observable<Parks>{

    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Parks>(this.getParksURL, {}, {headers})
  }

}
