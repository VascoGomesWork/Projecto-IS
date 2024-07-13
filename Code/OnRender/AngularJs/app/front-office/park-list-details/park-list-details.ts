import { ParkReserve } from "../park-list/park-reserves";
import { ReserveResult } from "../park-list/reserve-result";
import { Parks } from "../parks";
import { Vehicle } from "../register/vehicle";
import { Park } from "./park";

export class ParkListDetails{
    constructor(
        public ID: string,
        public address: string,
        public firstName: string,
        public lastName: string,
        public park: Parks,
        public phoneNumber: string,
        public reserve: ParkReserve,
        public vehicle: Vehicle
    ){}
}