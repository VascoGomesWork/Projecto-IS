export class ReserveParkingSpotData{
    constructor(public beginningTimestamp: string, public endingTimestamp: string, public parkID: string,
        public spotID: string, public userID: string
    ){
        this.beginningTimestamp = beginningTimestamp,
        this.endingTimestamp = endingTimestamp,
        this.parkID = parkID,
        this.spotID = spotID,
        this.userID = userID
    }
}