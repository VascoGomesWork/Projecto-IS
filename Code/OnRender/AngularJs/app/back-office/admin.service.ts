import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenServiceService } from '../shared/token/token-service.service';
import { of } from 'rxjs';
import { AbrirCancelaResponse } from './abrir-cancela-response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private cancelaURL = "https://fast-api-parklookup.onrender.com/open_door"

  constructor(private http: HttpClient, private tokenService: TokenServiceService) { }

  abrirCancela(){

    const cancelaData = {
      "spotID": "1",
      "parkID": "1"
    }

    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<AbrirCancelaResponse>(this.cancelaURL, cancelaData, {headers})
  }
}
