import { ID } from "../google-maps/id";
import { Parks } from "../parks";

export class ParkReserve{
    constructor(
        public _id: ID,
        public beginningTimestamp: string,
        public endingTimestamp: string,
        public parkID: string,
        public spotID: string,
        public userID: string,
        public isOpenable: boolean,
        public isActive: boolean,
        public parkName: string
    ){}
}