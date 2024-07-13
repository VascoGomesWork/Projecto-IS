import { ID } from "../../front-office/google-maps/id";

export class MaintenanceArchiveResult{
    constructor(
        public _id: ID,
        public spotID: string,
        public parkID: string,
        public referenceID: string
    ){}
}