/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

#include <Arduino.h>

#include "parkingSpaces.h"
#include "configs.h"

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/*
    This function check if the a specific parking space 
    is ocupied.
    Return - true if the space is ocupied, false if don't
*/
char isSpaceOccupied(Spot spot) {
    int irSensorSpotState = hasObjectIrSensor(spot.irSensor);
    // int usSensorSpotState = hasObjectUsSensor(spot.usSensor);
    
    if (irSensorSpotState >= 1) // + usSensorSpotState >= 1) 
        return '1';

    return '0';
}

/////////////////////////////////////////////////////////

/*
    This function prepare the parcking lot 
    occupation status
*/
ParkingSpaces getParkingSpacesData() {
    ParkingSpaces parkingSpaces;

    ///////////////////////////

    // Set IR sensors
    parkingSpaces.spot1.irSensor.pin = SPOT_1_IR_SENSOR;
    parkingSpaces.spot2.irSensor.pin = SPOT_2_IR_SENSOR;
    parkingSpaces.spot3.irSensor.pin = SPOT_3_IR_SENSOR;

    ///////////////////////////

    // Set US sensors
    parkingSpaces.spot1.usSensor.pinTrig = SPOT_1_US_SENSOR_TRIG;
    parkingSpaces.spot1.usSensor.pinEcho = SPOT_1_US_SENSOR_ECHO;

    parkingSpaces.spot2.usSensor.pinTrig = SPOT_2_US_SENSOR_TRIG;
    parkingSpaces.spot2.usSensor.pinEcho = SPOT_2_US_SENSOR_ECHO;

    parkingSpaces.spot3.usSensor.pinTrig = SPOT_3_US_SENSOR_TRIG;
    parkingSpaces.spot3.usSensor.pinEcho = SPOT_3_US_SENSOR_ECHO;

    ///////////////////////////

    // Checks the occupation of the parking space
    char occupationStatusSpot1 = isSpaceOccupied(parkingSpaces.spot1);
    parkingSpaces.spot1.occupation = occupationStatusSpot1;

    char occupationStatusSpot2 = isSpaceOccupied(parkingSpaces.spot2);
    parkingSpaces.spot2.occupation = occupationStatusSpot2;

    char occupationStatusSpot3 = isSpaceOccupied(parkingSpaces.spot3);
    parkingSpaces.spot3.occupation = occupationStatusSpot3;

    ///////////////////////////

    return parkingSpaces;
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////