export class MapMarkers{

    constructor(public position: google.maps.LatLngLiteral, public icon: google.maps.Icon, public title: string, public info: string,
        public index: number
    ){}
}