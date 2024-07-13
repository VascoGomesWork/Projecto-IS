import { ID } from "../../front-office/google-maps/id";

export class UpdateArchiveResult{
    constructor(
        public _id: ID,
        public spots: Spots
    ){}
}

export class Spots{
    constructor(
        public spotID: string,
        public isOccupied: string,
        public isMaintenance: string
    ){}
}