import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { LoginUserResponse } from './login-user-response';
import { LoginUser } from './login-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private loginURL = "https://fast-api-parklookup.onrender.com/login"

  constructor(private http: HttpClient, private tokenService: TokenServiceService) { }

  loginUser(loginData: LoginUser): Observable<LoginUserResponse>{

    const token = this.tokenService.returnToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<LoginUserResponse>(this.loginURL, loginData, {headers})

  }
}
