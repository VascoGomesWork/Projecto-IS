import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenBody } from './token-body';
import { CookieService } from 'ngx-cookie-service';
import { TokenResponse } from './token-response';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  private tokenURL = "https://fast-api-parklookup.onrender.com/get_token"
  token: string = "";

  constructor(private http: HttpClient) {}

  //Checks if Token already exists gets the existing token
  

  saveToken(){

    console.log("Save Token Function")

    if(localStorage.getItem('token') == null){

      console.log("SALVOU")
      //Constructs the Token
      const tokenBody: TokenBody = {
        "ID": "user1@users.ur",
        "password": "Teste123!"
      }

      //Gets the Token and subscribes to get it's value
      this.getToken(tokenBody).subscribe((token: TokenResponse) => {
        this.token = token.token
        //Puts token in Browser Cookies
        localStorage.setItem('token', token.token)
      })
    }
  }

  saveUserEmail(userEmail: string){

    console.log("Save User Email Function")

    localStorage.setItem('userEmail', userEmail)
  }

  saveIsHandicap(isHandicap: string){
    localStorage.setItem('isHandicap', isHandicap)
  }

  removeUserEmail(){
    localStorage.setItem('userEmail', '')
  }

  removeIsHandicap(){
    localStorage.setItem('isHandicap', 'false')
  }

   getToken(tokenBody: TokenBody): Observable<TokenResponse>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const tokenPost = this.http.post<TokenResponse>(this.tokenURL, tokenBody, {headers})

    console.log("Token Post = " + tokenPost)

    return tokenPost
   }

   returnToken(){
    return localStorage.getItem("token")
   }

   returnUserEmail(){
    return localStorage!.getItem("userEmail")
   }

   returnIsHandicap(){
    return localStorage!.getItem("isHandicap")
   }
}
