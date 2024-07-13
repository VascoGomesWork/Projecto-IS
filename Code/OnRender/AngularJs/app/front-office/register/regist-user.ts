export interface RegistUser{
    ID: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    isAdmin: boolean,
    vehicle: {
        registrationPlate: string,
        vehicleBrand: string,
        vehicleType: string,
        vehicleFuel: string
    }
}

