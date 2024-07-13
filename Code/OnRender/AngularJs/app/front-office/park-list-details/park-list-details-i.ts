import { ParkReserve } from "../park-list/park-reserves";
import { Parks } from "../parks";
import { Vehicle } from "../register/vehicle";

export interface ParkListDetailsI{

    ID: string,
    address: string,
    firstName: string,
    lastName: string,
    park: Parks,
    phoneNumber: string,
    reserve: ParkReserve,
    vehicle: Vehicle
}