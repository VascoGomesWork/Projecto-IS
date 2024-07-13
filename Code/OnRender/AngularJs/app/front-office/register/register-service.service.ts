import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { RegistUser } from './regist-user';
import { RegistUserResponse } from './regist-user-responde';
import { UserData } from './user-data';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {


  private registerURL = "https://fast-api-parklookup.onrender.com/create_user"

  constructor(private http: HttpClient, private tokenService: TokenServiceService) {}

  saveToken(){
    console.log("Save Token")

    this.tokenService.saveToken()
  }


  registUser(userData: UserData): Observable<RegistUserResponse>{

    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<RegistUserResponse>(this.registerURL, userData, {headers})
  }

}
