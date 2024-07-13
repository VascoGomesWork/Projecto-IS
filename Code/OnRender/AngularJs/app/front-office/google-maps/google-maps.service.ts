import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { CityPark } from './city-park';
import { GetParkResponse } from './get-park-response';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private getAllParksURL = "https://fast-api-parklookup.onrender.com/get_parks"

  private cityParkList: CityPark[] = []
  private parkDataBody = {"ID": "1"}
  constructor(private http: HttpClient, private tokenService: TokenServiceService) { }

  //Get the 3 Parks available for each City
  getAllParks(city: string): Observable<CityPark>{
    
    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<CityPark>(this.getAllParksURL, {}, {headers})
  }

  getParkIdList(city: string): number[]{

    switch (city){

      case "Beja":
        return [1, 2, 3]

      case "Lisboa":
        return [4, 5, 6]

      case "Porto":
        return [7, 8, 9]

      case "Aveiro":
        return [10, 11, 12]

    }

    return []
  }
  private closeInfoWindowSubject = new Subject<void>();
  closeInfoWindow$ = this.closeInfoWindowSubject.asObservable();

  closeMapInfoWindow(){
    console.log("CLOSE SERVICE")
    this.closeInfoWindowSubject.next();
  }

}
