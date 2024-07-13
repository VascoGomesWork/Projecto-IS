import { ID } from "../google-maps/id"
import { Spots } from "../google-maps/spots"

export class ParkObject{
    constructor(
        public ID: string,
        public latitude: number,
        public longitude: number,
        public name: string,
        public number_spots: number,
    ){}
}
