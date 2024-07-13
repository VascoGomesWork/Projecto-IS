/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

#include <Arduino.h>
#include "usSensor.h"
#include "configs.h"

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

/*
    This function gets, through a ultrasonic proximity
    sensor, the distance between the sensor and 
    an object. 
    Return - the distance between the sensor and 
    an object in centimiters.
*/
float getDistance(UsSensor usSensor) {
    long duration = 0;
    float distanceCm = 0;

    ///////////////////////////

    // Clears the trigPin
    digitalWrite(usSensor.pinTrig, LOW);
    delayMicroseconds(2);

    ///////////////////////////

    // Sets the trigPin on HIGH state for 10 micro seconds
    digitalWrite(usSensor.pinTrig, HIGH);
    delayMicroseconds(10);
    digitalWrite(usSensor.pinTrig, LOW);

    ///////////////////////////
    
    // Reads the pinEcho, returns the sound wave travel time in microseconds
    duration = pulseIn(usSensor.pinEcho, HIGH);

    ///////////////////////////

    // Calculate the distance
    distanceCm = duration * SOUND_SPEED/2;

    //Serial.printf("Space US pinTrig %d --- pinEcho %d --- distance %d\n", usSensor.pinTrig, usSensor.pinEcho, distanceCm);

    return distanceCm;
}

/////////////////////////////////////////////////////////

int hasObjectUsSensor(UsSensor usSensor) {
    float distance = getDistance(usSensor);

    if (distance <= MIN_DISTANCE)
        return 1;

    return 0;
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////