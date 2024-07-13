import { MapsPosition } from "./position-interface";
import { Spots } from "./spots";

export interface MapMarkerInterface{
    ID: string
    position: google.maps.LatLngLiteral,
    icon: google.maps.Icon,
    title: string,
    info: string,
    status: string,
    number_spots: number,
    number_special_necessity_spots: number,
    number_total_spots: number,
    spots: Spots[],
    city: string,
    index: number
}