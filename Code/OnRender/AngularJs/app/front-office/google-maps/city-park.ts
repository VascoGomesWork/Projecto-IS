import { Result } from "./result";

export class CityPark{

    constructor(public success: boolean, public result: Result[], public city: string, public status: string){}   
}