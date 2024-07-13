import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from './login-service.service';
import { LoginUser } from './login-user';
import { LoginUserResponse } from './login-user-response';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { ParkListServiceService } from '../park-list/park-list-service.service';
import { ParkList } from '../park-list/park-list';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup
  isSubmited: boolean = false
  loginSuccessfull: boolean = false
  parkList!: ParkList

  constructor(private loginService: LoginServiceService, private fb: FormBuilder, private router: Router, 
    private tokenService: TokenServiceService, private parkListService: ParkListServiceService){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password(){
    return this.loginForm.get('password')!;
  }

  login(){

    this.isSubmited = true

    console.log("Username = " + this.email.value)
    console.log("Password = " + this.password.value)

    //Checks if the Login Form is Valid
    if(this.loginForm.valid){
      console.log("Login Form Valid")

      //Saves the User Email
      this.tokenService.saveUserEmail(this.email.value)

      const loginData = new LoginUser(this.email.value, this.password.value)

      this.loginService.loginUser(loginData).subscribe((loginUserResponse: LoginUserResponse) => {
        this.loginSuccessfull = loginUserResponse.success
        console.log("Login Successfull RESPONSE = ", this.loginSuccessfull)

        if(this.loginSuccessfull == true){

          //Checks if the User is Admin and Redirects it to Backoffice
          this.parkListService.getAllReservedParks().subscribe((parkList: ParkList) => {
            this.parkList = parkList
            
            console.log("Is Admin Variable = ", parkList)

            if(parkList.result.isHandicap){
              this.tokenService.saveIsHandicap("true")
            }
          })

          setTimeout(() => {

            if(this.parkList.result.isAdmin){
              console.log("IS ADMIN")
              this.goToBackoffice()
            } else {
              this.goToMap()
            }
          }, 2500)
        }
      })
    }

  }

  goToMap(){
    this.router.navigateByUrl("/")
  }

  goToBackoffice(){
    this.router.navigateByUrl("backoffice")
  }

}
