import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterServiceService } from './register-service.service';
import { Route, Router } from '@angular/router';
import { UserData } from './user-data';
import { Vehicle } from './vehicle';
import { RegistUserResponse } from './regist-user-responde';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { ParkListServiceService } from '../park-list/park-list-service.service';
import { ParkList } from '../park-list/park-list';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  registerForm!: FormGroup
  isSubmited: boolean = false
  registSuccessful: boolean = false
  constructor(private registerService: RegisterServiceService, private fb: FormBuilder, private router: Router, private tokenService: TokenServiceService,
    private parkListService: ParkListServiceService
  ){}

  ngOnInit(){
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      apelido: ['', [Validators.required, Validators.minLength(3)]],
      telemovel: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      morada: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(3)]],
      matricula: ['', [Validators.required, Validators.minLength(3)]],
      marca: ['', [Validators.required, Validators.minLength(3)]],
      tipoCarroceria: ['', [Validators.required, Validators.minLength(3)]],
      tipoCombustivel: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  get nome() {
    return this.registerForm.get('nome')!;
  }

  get apelido(){
    return this.registerForm.get('apelido')!;
  }

  get telemovel(){
    return this.registerForm.get('telemovel')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get morada(){
    return this.registerForm.get('morada')!;
  }

  get password(){
    return this.registerForm.get('password')!;
  }

  get repeatPassword(){
    return this.registerForm.get('repeatPassword')!;
  }

  get matricula(){
    return this.registerForm.get('matricula')!;
  }

  get marca(){
    return this.registerForm.get('marca')!;
  }

  get tipoCarroceria() {
    return this.registerForm.get('tipoCarroceria')!;
  }

  get tipoCombustivel(){
    return this.registerForm.get('tipoCombustivel')!;
  }

  regist(){

    this.isSubmited = true

    console.log("Nome = " + this.nome.value)
    console.log("Apelido = " + this.apelido.value)
    console.log("Telemovel = " + this.telemovel.value)
    console.log("Email = " + this.email.value)
    console.log("Morada = " + this.morada.value)
    console.log("Password = " + this.password.value)
    console.log("Repeat Password = " + this.repeatPassword.value)

    console.log("Matrícula = " + this.matricula.value)
    console.log("Marca = " + this.marca.value)
    console.log("Tipo Carroceria = " + this.tipoCarroceria.value)
    console.log("Tipo Combustivel = " + this.tipoCombustivel.value)

    console.log("Form Válido = ", this.registerForm.valid)

    //Checks id the Register Form is Valid
    if(this.registerForm.valid){
      //Saves the token
      this.registerService.saveToken()

      //Saves the User Email
      this.tokenService.saveUserEmail(this.email.value)

      const vehicle = new Vehicle(this.matricula.value, this.marca.value, this.tipoCarroceria.value, this.tipoCombustivel.value)

      const userData = new UserData(this.email.value, this.password.value, this.nome.value, this.apelido.value, this.telemovel.value, 
        this.morada.value, false, vehicle);

        console.log("REgist UserData = ", userData)

      //Regists the User
      this.registerService.registUser(userData).subscribe((response: RegistUserResponse) => {
        this.registSuccessful = response.success
        console.log("Regist Successful = ", this.registSuccessful)

        if(this.registSuccessful == true){
          setTimeout(() => {
            this.router.navigateByUrl("/login")
          }, 3000)
        }
      })
    }
  }

  goToMap(){
    this.router.navigateByUrl("/")
  }

}
