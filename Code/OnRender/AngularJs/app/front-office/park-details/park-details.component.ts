import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { MapMarkerInterface } from '../google-maps/marker-interface';
import { MapMarker } from '@angular/google-maps';
import { MapMarkers } from '../google-maps/map-marker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReserveServiceService } from './reserve-service.service';
import { ReserveParkingResponse } from './reserve-parking-response';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { ReserveParkingSpotData } from './reserve-parking-data';
import { Store } from '@ngrx/store';
import { State } from '../../shared/store/state';
import { changeParkReserve } from '../../shared/actions/actions';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { ParkListServiceService } from '../park-list/park-list-service.service';
import { ParkList } from '../park-list/park-list';

@Component({
  selector: 'app-park-details',
  templateUrl: './park-details.component.html',
  styleUrl: './park-details.component.css'
})
export class ParkDetailsComponent {

  reserveParkingSpotForm!: FormGroup
  isSubmited: boolean = false
  reserveParkingSpotSuccessful: boolean = false
  isHandicap: Boolean = false
  public isLoading: boolean = true

  @Input() marker!: MapMarkerInterface
 
  //gm-ui-hover-effect

  constructor(private fb: FormBuilder, private reserveService: ReserveServiceService, private tokenService: TokenServiceService,
    private store: Store<State>, private googleMapService: GoogleMapsService, private parkListService: ParkListServiceService
  ){

    this.parkListService.getAllReservedParks().subscribe((parkList: ParkList) => {
      this.isHandicap = parkList.result.isHandicap
      
      console.log("-----------------------------------TESTE INICIAL---------------------------------------")
      console.log("isHANDICAP = ", this.isHandicap)
      console.log("Está Ocupado = ", this.marker.spots[0].isOccupied)
      console.log("É reservável = ", this.marker.spots[0].isReservable)
      console.log("Está em Manutenção = ", this.marker.spots[0].isMaintenance)
      console.log("-----------------------------------TESTE FINAL---------------------------------------")
    })
    
    console.log("PARK DETAILS MARKER = ", this.marker)
  }

  ngOnInit(){
    
    this.reserveParkingSpotForm = this.fb.group({
      spot: ['', [Validators.required, Validators.minLength(1)]],
      horaSaida: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  get spot() {
    return this.reserveParkingSpotForm.get('spot')!;
  }

  get horaSaida(){
    return this.reserveParkingSpotForm.get('horaSaida')!;
  }

  

  reserveParkingSpot(){

    this.isSubmited = true

    //If it is not a Handicap makes the Form Valid anyways
    if(this.isHandicap == false){
      console.log("NORMAL")
      this.reserveParkingSpotForm.patchValue({
        spot: "1",
        horaSaida: "2024-06-25T02:01:02:01:18.168000+01:00"
      })
    }

    console.log("Spot = " + this.spot.value)
    console.log("Hora Saida = ", this.horaSaida.value)

    console.log("Erros Form = ", this.reserveParkingSpotForm.valid)

    //Checks id the Register Form is Valid
    if(this.reserveParkingSpotForm.valid){
      console.log("Não existem Erros")

      //Get User Email to Local Storage
      const userEmail = this.tokenService.returnUserEmail()

      const beginningTimestamp = this.getFormattedTimestamp(false)
      const endingTimestamp = this.getFormattedTimestamp(true)
      console.log("Ending Timestamp = ", endingTimestamp)

      const reserveParkingSpotData = new ReserveParkingSpotData(beginningTimestamp, endingTimestamp, this.marker.ID, this.spot.value+"", userEmail+"")

      this.reserveService.reserveParkingSpot(reserveParkingSpotData).subscribe((response: ReserveParkingResponse) => {
        
        //Show Success Alert
        this.reserveParkingSpotSuccessful = response.success

        setTimeout(() => {
          this.reserveParkingSpotSuccessful = false
        }, 4000)
        
        console.log("Regist Successful = ", this.reserveParkingSpotSuccessful)

        //Changes the Store Reserve to True
        this.store.dispatch(changeParkReserve({reserve: true}))
        
      })
    }
  }

  
  hours: string = ""
  minutes: string = ""      
  getFormattedTimestamp(horaSaida: boolean): string {
    const date = new Date();
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    if(horaSaida != true){
      this.hours = String(date.getHours()).padStart(2, '0');
      this.minutes = String(date.getMinutes()).padStart(2, '0');
    } else {
      this.hours = String(this.horaSaida.value).padStart(2, '0');
      this.minutes = String(this.horaSaida.value).padStart(2, '0');
    }
    
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0') + "000"; // Add extra zeros to match the ssssss format
  
    const timezoneOffset = -date.getTimezoneOffset();
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
    
    // Format the timestamp
    const formattedTimestamp = `${year}-${month}-${day}T${this.hours}:${this.minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
  
    return formattedTimestamp;
  }

  closeInfoWindow(){
    console.log("CLOSE")
    this.googleMapService.closeInfoWindow$
  }

}
function Ouput(): (target: ParkDetailsComponent, propertyKey: "reserveFormSuccess") => void {
  throw new Error('Function not implemented.');
}

