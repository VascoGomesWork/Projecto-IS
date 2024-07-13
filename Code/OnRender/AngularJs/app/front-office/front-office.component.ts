import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../shared/store/state';
import { changeLocation, changeParkReserve } from '../shared/actions/actions';
@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrl: './front-office.component.css'
})
export class FrontOfficeComponent {

  constructor(private fb: FormBuilder, private store: Store<State>){}

  parkLocationChoosen = { lat: 38.01533663339709, lng: -7.862260498887872}
  parksForm!: FormGroup
  parksLocations = [
    {
      cidade: "Beja",
      position: { lat: 38.01533663339709, lng: -7.862260498887872}
    },

    {
      cidade: "Lisboa",
      position: {lat: 38.72369677279224, lng: -9.139140169275105}
    },

    {
      cidade: "Porto",
      position: {lat: 41.15828301735345, lng: -8.6301969959457}
    },

    {
      cidade: "Aveiro",
      position: {lat: 40.64015463925072, lng: -8.654413557321302}
    }
  ]

  ngOnInit(){
    this.parksForm = this.fb.group({
      parksLocation: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  get parksLocation() {
    return this.parksForm.get('parksLocation')!;
  }

  changeLocation(){
    console.log("Localização Escolhida = ", this.parksLocation.value)

    //Changes the Store Reserve to True
    this.store.dispatch(changeParkReserve({reserve: false}))
   
    switch (this.parksLocation.value){

      case "Beja":
        //this.parkLocationChoosen = this.parksLocations[0].position;
        console.log("Beja Position = " + {position:this.parksLocations[0].position}.position.lat)
        this.store.dispatch(changeLocation({position:this.parksLocations[0].position, city: "Beja"}))
        break;
      
      case "Lisboa":
        console.log("Lisboa Position = " + {position:this.parksLocations[1].position})
        //this.parkLocationChoosen = this.parksLocations[1].position;
        this.store.dispatch(changeLocation({position:this.parksLocations[1].position, city: "Lisboa"}))
        break;

      case "Porto":
        console.log("Porto Position = " + {position:this.parksLocations[2].position})
        //this.parkLocationChoosen = this.parksLocations[2].position;
        this.store.dispatch(changeLocation({position:this.parksLocations[2].position, city: "Porto"}))
        break;

      case "Aveiro":
        console.log("Aveiro Position = " + {position:this.parksLocations[3].position})
        //this.parkLocationChoosen = this.parksLocations[3].position;
        this.store.dispatch(changeLocation({position:this.parksLocations[3].position, city: "Aveiro"}))
        break;

    }

    return this.parkLocationChoosen
  }

}
