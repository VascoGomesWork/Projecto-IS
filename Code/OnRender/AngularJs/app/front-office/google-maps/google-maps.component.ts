import { AfterViewInit, Component, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapDirectionsService, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapMarkerInterface } from './marker-interface';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../shared/store/state';
import { changeLocation, changeParkReserve } from '../../shared/actions/actions';
import { GoogleMapsService } from './google-maps.service';
import { CityPark } from './city-park';
import { Spots } from './spots';
import { TokenServiceService } from '../../shared/token/token-service.service';
import { ReserveServiceService } from '../park-details/reserve-service.service';
import { ParkListServiceService } from '../park-list/park-list-service.service';
import { ParkList } from '../park-list/park-list';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrl: './google-maps.component.css'
})
export class GoogleMapsComponent implements OnChanges, AfterViewInit {

  @ViewChild(MapInfoWindow)
  infoWindow!: MapInfoWindow;

  enableParkingAlert: boolean = false;
  directionsResult: google.maps.DirectionsResult | undefined;

  parkLocation = {position: { lat: 38.72369677279224, lng: -9.139140169275105}}
  cityParkLocation = ""
  cityParkListMaps: any[] = []
  isHandicap: Boolean = false
  
  center: google.maps.LatLngLiteral = {
    lat: this.parkLocation.position.lat,
    lng: this.parkLocation.position.lng
};

display: any;
    

//MARKER DISABLED PARK NORMAL
carLocation: google.maps.Icon = {
  url: '../../../assets/img/car.png', // Path to your custom marker image
  scaledSize: new google.maps.Size(50, 50), // Size of the custom marker
  origin: new google.maps.Point(0, 0), // Origin of the image
  anchor: new google.maps.Point(12.5, 12.5) // Anchor point of the marker
};

//MARKER DISABLED PARK NORMAL
markerDisabledParkIcon: google.maps.Icon = {
  url: this.isHandicap == true ? '../../../assets/img/handicap.png' : '../../../assets/img/park.png', // Path to your custom marker image
  scaledSize: new google.maps.Size(50, 50), // Size of the custom marker
  origin: new google.maps.Point(0, 0), // Origin of the image
  anchor: new google.maps.Point(12.5, 12.5) // Anchor point of the marker
};

//MARKER DISABLED PARK EMPTY
markerDisabledParkEmptyIcon: google.maps.Icon = {
  url: this.isHandicap == true ? '../../../assets/img/handicap_green.png' : '../../../assets/img/park_green.png', // Path to your custom marker image
  scaledSize: new google.maps.Size(50, 50), // Size of the custom marker
  origin: new google.maps.Point(0, 0), // Origin of the image
  anchor: new google.maps.Point(12.5, 12.5) // Anchor point of the marker
};

//MARKER DISABLED PARK FULL
markerDisabledParkFullIcon: google.maps.Icon = {
  url: this.isHandicap == true ? '../../../assets/img/handicap_red.png' : '../../../assets/img/park_red.png', // Path to your custom marker image
  scaledSize: new google.maps.Size(50, 50), // Size of the custom marker
  origin: new google.maps.Point(0, 0), // Origin of the image
  anchor: new google.maps.Point(12.5, 12.5) // Anchor point of the marker
};

@Output() selectedMarker!: MapMarkerInterface

markers: MapMarkerInterface[] = [

  //MARKER BEJA DISABLED PARK NORMAL -> 0
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:0
  },

  //MARKER BEJA DISABLED PARK EMPTY -> 1
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:1
  },

  //MARKER BEJA DISABLED PARK FULL -> 2
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:2
  },

  //////////////////LISBOA/////////////////////////
  //MARKER LISBOA DISABLED PARK NORMAL -> 3
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:3
  },

  //MARKER LISBOA DISABLED PARK EMPTY -> 4
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:4
  },

  //MARKER LISBOA DISABLED PARK FULL -> 5
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:5
  },

  //////////////////PORTO/////////////////////////
  //MARKER PORTO DISABLED PARK NORMAL -> 6
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:6
  },

  //MARKER PORTO DISABLED PARK EMPTY -> 7
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:7
  },

  //MARKER PORTO DISABLED PARK FULL -> 8
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:8
  },

  //////////////////AVEIRO/////////////////////////
  //MARKER AVEIRO DISABLED PARK NORMAL -> 9
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:9
  },

  //MARKER AVEIRO DISABLED PARK EMPTY -> 10
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:10
  },

  //MARKER AVEIRO DISABLED PARK FULL -> 11
  {
    ID: "",
    position: { lat: 0.0,lng: 0.0 },
    icon: this.markerDisabledParkIcon,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:11
  },

  ////////////////////////////CAR BEJA////////////////////////////////////
  // -> 12
  {
    ID: "",
    position: { lat: 38.00957352071707, lng: -7.876326887254 },
    icon: this.carLocation,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:12
  },

  ////////////////////////////CAR LISBOA////////////////////////////////////
  // -> 13
  {
    ID: "",
    position: { lat: 38.74083716727696, lng: -9.204543076230115 },
    icon: this.carLocation,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:13
  },

  ////////////////////////////CAR PORTO////////////////////////////////////
  // -> 14
  {
    ID: "",
    position: { lat: 41.178120640510514, lng: -8.655198771873607 },
    icon: this.carLocation,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:14
  },

  ////////////////////////////CAR AVEIRO////////////////////////////////////
  // -> 15
  {
    ID: "",
    position: { lat: 40.64940789413248, lng: -8.623942978788497 },
    icon: this.carLocation,
    title: 'New York',
    info: 'New York, NY, USA',
    status: "normal",
    number_spots: 0,
    number_special_necessity_spots: 0,
    number_total_spots: 0,
    city: 'Beja',
    spots: new Array,
    index:15
  },

];

  zoom = 12;
  choosenCity: string = "Beja"
  map!: google.maps.Map;

  constructor(private router:Router, private mapDirectionsService: MapDirectionsService, private store: Store<State>,
     private googleMapsService: GoogleMapsService, private tokenService: TokenServiceService, private parkListService: ParkListServiceService
  ) {

    this.parkListService.getAllReservedParks().subscribe((parkList: any) => {
      this.isHandicap = parkList.result.isHandicap
      console.log("isHANDICAP = ", this.isHandicap)
      //console.log("isHANDICAP 2 = ", tokenService.returnIsHandicap())

      //Updates the Parks Icons
      this.isHandicap = parkList.result.isHandicap

      this.markerDisabledParkIcon.url = this.isHandicap == true ? '../../../assets/img/handicap.png' : '../../../assets/img/park.png'
      this.markerDisabledParkEmptyIcon.url = this.isHandicap == true ? '../../../assets/img/handicap_green.png' : '../../../assets/img/park_green.png'
      this.markerDisabledParkFullIcon.url = this.isHandicap == true ? '../../../assets/img/handicap_red.png' : '../../../assets/img/park_red.png'
    
       // Initialize the map so the Marker Icons Reload as well
        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: this.center,
          zoom: this.zoom
        });
    })
      
    //Gets Data from the Store
    store.select(changeLocation).subscribe((parkLocation: any) => {

      //Changes the Center of the Map
      this.center = {
        lat: parkLocation.position.position.lat,
        lng: parkLocation.position.position.lng
      }

      this.choosenCity = parkLocation.position.city

      this.cityParkLocation = parkLocation.position.city

      /*console.log("Park Location = ", parkLocation.position.position , " City = ", parkLocation.position.city)
      console.log("PARK LOCATION LAT= ", this.parkLocation.position.lat)
      console.log("PARK LOCATION LNG= ", this.parkLocation.position.lng)*/
  
      //Get the 3 Parks available for each City from Google-Maps Service
      this.googleMapsService.getAllParks(this.cityParkLocation).subscribe((cityParkList: CityPark) => {
        //console.log("City Park = ", cityParkList)
    
        //this.cityParkListMaps = cityParkList
        //console.log("CHOOSEN CITY = ", this.choosenCity)
        
        this.defineMarkersBeja(cityParkList)

        this.showMap = true
        //console.log("Show Map = ", this.showMap)

      })


    })

    
  }

  defineMarkersBeja(cityParkList: CityPark){
    //Only Working to Beja
    console.log("Result Beja = ", cityParkList.result)
    
    for(let i = 0; i < cityParkList.result.length; i++){

      //Park 1
      this.markers[i].ID = cityParkList.result[i].ID
      this.markers[i].position.lat = cityParkList.result[i].latitude
      this.markers[i].position.lng = cityParkList.result[i].longitude
      this.markers[i].title = cityParkList.result[i].name
      this.markers[i].number_special_necessity_spots = cityParkList.result[i].number_special_necessity_spots
      this.markers[i].number_spots = cityParkList.result[i].number_spots
      this.markers[i].number_total_spots = cityParkList.result[i].number_total_spots
      this.markers[i].spots = cityParkList.result[i].spots
      this.markers[i].status = cityParkList.result[i].status

      //Checks if status is normal, empty or full and puts the designated marker on
      if(cityParkList.result[i].status == "normal"){
        this.markers[i].icon = this.markerDisabledParkIcon
      } else if(cityParkList.result[i].status == "empty"){
        this.markers[i].icon = this.markerDisabledParkEmptyIcon
      } else {
        this.markers[i].icon = this.markerDisabledParkFullIcon
      }

      
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

    showMap: boolean = false  
    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
      this.googleMapsService.closeInfoWindow$.subscribe(() => {
        //console.log("CHEGOUU")
        if (this.infoWindow){
          this.infoWindow.close()
        }
      })
    }
  
    /*------------------------------------------
    --------------------------------------------
    moveMap()
    --------------------------------------------
    --------------------------------------------*/
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
  
    /*------------------------------------------
    --------------------------------------------
    move()
    --------------------------------------------
    --------------------------------------------*/
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }

    getDirections(currentCarLocation: MapMarkerInterface, parkLocation: MapMarkerInterface){

      console.log("DIRECTIONS ")
      //https://youtu.be/K9FeVmBQW8o -> Video to be used
      const drivingRequest: google.maps.DirectionsRequest = {
        origin: currentCarLocation.position,
        destination: parkLocation.position,
        travelMode: google.maps.TravelMode.DRIVING
      };
        

        console.log("Driving Request Origin = " + drivingRequest.origin.valueOf())
        console.log("Driving Request destination = " + drivingRequest.destination.valueOf())

        this.mapDirectionsService.route(drivingRequest).pipe(
          map(res => res.result)).subscribe((result) => {
            this.directionsResult = result
            //console.log("RESULT = " + result)
          })
    }
  
    @Input() reserveFormSuccess: boolean = false

    getDisabledPark(marker: MapMarker, info: String, indexMarker: number){

      console.log("MARKER = ", this.markers[indexMarker])
      console.log("Index = ", indexMarker)

      //Fufills the Selected Marker
      this.selectedMarker = this.markers[indexMarker]
      
      this.infoWindow.open(marker);

      //Checks if the Reserve has been Successful
      //Gets Data from the Store
        this.store.select(changeParkReserve).subscribe((reserve: any) => {

          console.log("Reserve State Park Store = ", reserve)
          //Checks if the reserve variable is true and Changes the Center of the Map
          reserve.position.reserve == true ? this.chooseCar(indexMarker) : ""
        }) 
    }

    chooseCar(indexMarker: number){
      //Chooses with car to use
      switch (this.choosenCity){
        case "Beja":
          this.getDirections(this.markers[12], this.markers[indexMarker]);
          break;

        case "Lisboa":
          this.getDirections(this.markers[13], this.markers[indexMarker]);
          break;

        case "Porto":
          this.getDirections(this.markers[14], this.markers[indexMarker]);
          break;

        case "Aveiro":
          this.getDirections(this.markers[15], this.markers[indexMarker]);
          break;

        default:
          console.log("Unknown City")
      }
    }

}
