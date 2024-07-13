import { ID } from "./id"
import { Spots } from "./spots"

export class Result{

    constructor(public _id: ID, public ID: string, public latitude: number, public longitude: number, public name: string,
        public number_spots: number, public number_special_necessity_spots: number, public number_total_spots: number, public spots: Spots[], public city: string, public status: string
    ){}

    
}