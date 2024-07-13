import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { ReserveParkingSpotData } from './reserve-parking-data';
import { ReserveParkingResponse } from './reserve-parking-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReserveServiceService {

  private reserveURL = "https://fast-api-parklookup.onrender.com/create_reserve"

  constructor(private http: HttpClient, private tokenService: TokenServiceService) {}


  reserveParkingSpot(reserveParkingSpotData: ReserveParkingSpotData): Observable<ReserveParkingResponse>{

    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

      console.log("Begin Time Stamp Service =", reserveParkingSpotData.beginningTimestamp)
      console.log("Ending Time Stamp Service =", reserveParkingSpotData.endingTimestamp)
      console.log("Park ID Service =", reserveParkingSpotData.parkID)
      console.log("Spot ID Service =", reserveParkingSpotData.spotID)
      console.log("User Email Service =", reserveParkingSpotData.userID)

    return this.http.post<ReserveParkingResponse>(this.reserveURL, reserveParkingSpotData, {headers})
  }
}
