/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

// Includes
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <string.h>
#include <esp_sleep.h>
#include "esp_err.h"
#include "configs.h"
#include "sensors/parkingSpaces.h"

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

// Global variables
WiFiClient wifiClient;
PubSubClient client(wifiClient);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function keeps the possibility to happen a 
    connection open
*/
void reconnect() {
	///////////////////////////
    // Try to connect
	while (!client.connected()) {
        Serial.println("..........Attempting MQTT connection..........");
        
        if (client.connect(BOARD_NAME, MQTT_USER, MQTT_PASS)) {
            Serial.println("..........Connected to MQTT broker..........");
        } else {
            Serial.println("..........Failed..........");
            Serial.println("..........Retrying in 3 seconds..........");
        
			///////////////////////////
            // Wait 3 seconds before retrying
            delay(3000);
        }
    }
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function sets the wifi connection
*/
void setupWifi() {
	///////////////////////////
    // WIFI information
    const char* ssid = SSID;
    const char* password = PASSWORD;
    
	///////////////////////////
    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(2000);
        Serial.println("..........Connecting to WiFi..........");
    }
    Serial.println("..........Connected to WiFi..........");   
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function publish parcking spaces status to server 
*/
void publishParkingSpacesData(ParkingSpaces parkingSpaces) {

    ///////////////////////////
    // Build the message to be published
    char spot1[6];
    strcpy(spot1, "false");
    if (parkingSpaces.spot1.occupation == '1') {
        strcpy(spot1, "true");
    }

    char spot2[6];
    strcpy(spot2, "false");
    if (parkingSpaces.spot2.occupation == '1') {
        strcpy(spot2, "true");
    }

    char spot3[6];
    strcpy(spot3, "false");
    if (parkingSpaces.spot3.occupation == '1') {
        strcpy(spot3, "true");
    }

    char message[300] = "{ \"parkID\": \"";
    strcat(message, PARK_ID);
    strcat(message, "\", \"spots\": [{ \"spotID\": \"");
    strcat(message, SPOT_ID_1);
    strcat(message, "\", \"isOccupied\": ");
    strcat(message, spot1);
    strcat(message, " }, { \"spotID\": \"");
    strcat(message, SPOT_ID_2);
    strcat(message, "\", \"isOccupied\": ");
    strcat(message, spot2);
    strcat(message, " }, { \"spotID\": \"");
    strcat(message, SPOT_ID_3);
    strcat(message, "\", \"isOccupied\": ");
    strcat(message, spot3);
    strcat(message, " }], \"referenceID\": \"");
    strcat(message, BOARD_ID);
    strcat(message, "\" }");

    ///////////////////////////
    // Your MQTT publish code goes here
    const char* topic = UPDATE_TOPIC;
    client.publish(topic, message, false);

    ///////////////////////////
    String labelMessage = "..........Message published: " + String(message) + ".........." ;
    Serial.println(labelMessage);
    
    String labelTopic = "..........On topic: " + String(topic) + ".........." ;
    Serial.println(labelTopic);
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function set ups the board
*/
void setup() {
    ///////////////////////////
    // Set Serial
    Serial.begin(115200);

    ///////////////////////////
    // Set Wifi
    setupWifi();

    ///////////////////////////
    // Connecting to server
    client.setServer(MQTT_SERVER, MQTT_PORT);

    ///////////////////////////
    // Set PIN modes
    pinMode(SPOT_1_IR_SENSOR, INPUT);
    pinMode(SPOT_2_IR_SENSOR, INPUT);
    pinMode(SPOT_3_IR_SENSOR, INPUT);
    
    pinMode(SPOT_1_US_SENSOR_TRIG, OUTPUT);
    pinMode(SPOT_1_US_SENSOR_ECHO, INPUT);
    pinMode(SPOT_2_US_SENSOR_TRIG, OUTPUT);
    pinMode(SPOT_2_US_SENSOR_ECHO, INPUT);
    pinMode(SPOT_3_US_SENSOR_TRIG, OUTPUT);
    pinMode(SPOT_3_US_SENSOR_ECHO, INPUT);

    ///////////////////////////
    // Set timer to sleep board
    uint64_t sleepTime = SLEEP_TIME * 1000000; // convert to microseconds
    esp_sleep_enable_timer_wakeup(sleepTime);
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function set ups the board
*/
void loop() {
    ///////////////////////////
    // Reconnect to server
    reconnect();

    /////////////////////
    // Getting and publishing status of parking spaces
    ParkingSpaces parkingSpaces = getParkingSpacesData();
    publishParkingSpacesData(parkingSpaces);

    client.loop();

    /////////////////////
    // Backing to sleep mode
    esp_deep_sleep_start();
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////