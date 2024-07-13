export interface Park{
            _id: {
                $oid: string
            },
            ID: string,
            latitude: number,
            longitude: number,
            name: string,
            number_spots: number,
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
    
