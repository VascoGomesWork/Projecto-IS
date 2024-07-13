export interface Parks{
    success: boolean,
    result: [
        {
            _id: {
                $oid: string
            },
            ID: string,
            latitude: number,
            longitude: number,
            name: string,
            number_spots: number,
            city: string,
            spots: [
                {
                    spotID: string,
                    isOccupied: boolean,
                    isMaintenance: boolean,
                    isEmpty: boolean | undefined,
                    isReservable: boolean | undefined,
                    
                }
            ]
        }
    ]
}