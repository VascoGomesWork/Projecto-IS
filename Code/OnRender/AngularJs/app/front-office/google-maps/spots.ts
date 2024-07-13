export class Spots{

    constructor(
        public spotID: string, 
        public isOccupied: boolean, 
        public isMaintenance:boolean,
        public isEmpty:boolean, 
        public isReservable: boolean
    ){}

}