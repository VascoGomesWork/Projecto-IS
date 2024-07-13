export interface GetParkResponse{
    "success": boolean,
    "result": {
        "_id": {
            "$oid": string
        },
        "ID": string,
        "latitude": number,
        "longitude": number,
        "name": string,
        "number_spots": number,
        "spots": [
            {
                "spotID": string,
                "isOccupied": boolean,
                "isMaintenance": boolean
            }
        ],
        "city": string,
        "status": string
    }
}