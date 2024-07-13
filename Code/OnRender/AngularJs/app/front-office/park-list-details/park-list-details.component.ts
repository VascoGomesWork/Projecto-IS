import { Component, Input } from '@angular/core';
import { ParkListDetails } from './park-list-details';
import { Router } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { ParkListServiceService } from '../park-list/park-list-service.service';
import { ParkList } from '../park-list/park-list';

@Component({
  selector: 'app-park-list-details',
  templateUrl: './park-list-details.component.html',
  styleUrl: './park-list-details.component.css'
})
export class ParkListDetailsComponent {

  public cidade!: string
  public parkName!: string
  public spot!: string
  public latitude!: string
  public longitude!: string
  public dataInicio!: string
  public dataFim!: string
  public matricula!: string
  public marca!: string
  public tipoCombustivel!: string
  public tipoVeiculo!: string

  public isHandicap!: Boolean
  
  constructor(private router: Router, private parkListService: ParkListServiceService){

    this.parkListService.getAllReservedParks().subscribe((parkList: ParkList) => {
      this.isHandicap = parkList.result.isHandicap
      console.log("isHANDICAP = ", this.isHandicap)
    })

    console.log("Park List Details in Details Page = ", history.state)

    this.parkName = "Nome do Parque: " + history.state.park.result.name
    this.cidade = "Cidade: " + history.state.park.result.city
    this.latitude = "Latitude: " + history.state.park.result.latitude
    this.longitude = "Longitude: " + history.state.park.result.longitude
    this.spot = "Lugar: " + history.state.reserve.spotID
    this.dataInicio = "Data Inicio: " + history.state.reserve.beginningTimestamp
    this.dataFim = "Data Fim: " + history.state.reserve.endingTimestamp
    this.matricula = "Matricula: " + history.state.vehicle.registrationPlate
    this.marca = "Marca: " + history.state.vehicle.vehicleBrand
    this.tipoCombustivel = "Tipo de Combustível: " + history.state.vehicle.vehicleFuel
    this.tipoVeiculo = "Tipo de Veículo: " + history.state.vehicle.vehicleType

    
    console.log("Park Name = ", this.parkName)
    console.log("Spot = ", this.cidade)
    console.log("Latitude = ", this.latitude)
    console.log("Longitude = ", this.longitude)
    console.log("Spot = ", this.spot)
    console.log("Data Inicio = ", this.dataInicio)
    console.log("Data Fim = ", this.dataFim)
    console.log("Matricula = ", this.matricula)
    console.log("Marca = ", this.marca)
    console.log("Tipo de Combustivel = ", this.tipoCombustivel)
    console.log("Tipo de Veículo = ", this.tipoVeiculo)
  }
  
  ngOnInit(){
    
  }

  
  parkDetails(){

  }

  goBack(){
    this.router.navigateByUrl("park-list")
  }

}
