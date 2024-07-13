import { Vehicle } from "./vehicle";

export class UserData{
    constructor(private ID: string, private password: string, private firstName: string, private lastName: string, private phoneNumber: string,
        private address: string, private isAdmin: false, private vehicle: Vehicle
    ){
        this.ID = ID,
        this.password = password,
        this.firstName = firstName,
        this.lastName = lastName,
        this.phoneNumber = phoneNumber,
        this.address = address,
        this.isAdmin = isAdmin,
        this.vehicle = vehicle
    }
}