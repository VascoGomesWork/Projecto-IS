export interface State{
    position: { lat: number, lng: number},
    city: string,
    reserve: boolean
}

export const initialState: State = {
    //Position Beja
    position: { lat: 38.01533663339709, lng: -7.862260498887872},
    city: "Beja",
    reserve: false
}
