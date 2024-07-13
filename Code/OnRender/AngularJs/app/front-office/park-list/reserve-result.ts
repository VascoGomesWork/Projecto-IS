import { Parks } from "../parks";
import { Vehicle } from "../register/vehicle";
import { ParkObject } from "./park-object";
import { ParkReserve } from "./park-reserves";

export class ReserveResult{
    constructor(
        public ID: string, 
        public address: string, 
        public firstName: string, 
        public lastName: string,
        public phoneNumber: string, 
        public reserves: ParkReserve[],
        public vehicle: Vehicle, 
        public park: Parks[],
        public parkName: string[],
        public isAdmin: Boolean,
        public isHandicap: Boolean
    ){}
    
}