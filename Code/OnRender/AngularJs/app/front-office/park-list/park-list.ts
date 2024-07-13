import { Result } from "../google-maps/result";
import { Parks } from "../parks";
import { ParkReserve } from "./park-reserves";
import { ReserveResult } from "./reserve-result";

export class ParkList{
    constructor(
        public success: string,
        public result: ReserveResult,
    ){}
}