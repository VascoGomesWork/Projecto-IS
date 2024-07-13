/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

// Includes
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <MFRC522.h>
#include <SPI.h>
#include <string>
#include <ESP32Servo.h>
#include "sensors/irSensor.h"
#include "sensors/usSensor.h"
#include "configs.h"

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

// GLobal variables
WiFiClient espClient;
PubSubClient client(espClient);
Servo servoMotor;

MFRC522 rfid(SS_PIN, RST_PIN);

int isCardAuthorized = 0;
int isValidateCardAuthTopicSubscribed = 0;

int isGateClosed = 1;
int toCloseCounter = 0;
int isMaintenance = 0;


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function check if the a specific parking space 
    is ocupied.
    Return - true if the space is ocupied, false if don't
*/
int isSpaceOccupied(IrSensor irSensor, UsSensor usSensor) {
    int irSensorSpaceState = hasObjectIrSensor(irSensor);
    int usSensorSpaceState = hasObjectUsSensor(usSensor);
    
    if (irSensorSpaceState + usSensorSpaceState >= 1) 
        return 1;

    return 0;
}


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
            client.subscribe(ESP32_OPEN_DOOR);
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
    This function send the data with maintenance to the server 
*/
void publishOpenDoorData() {
    ///////////////////////////
    // Build the message to be published
    char message[250] = "{ \"spotID\": \"";
    strcat(message, SPOT_ID);
    strcat(message, "\", \"parkID\": \"");
	strcat(message, PARK_ID);
	strcat(message, "\", \"referenceID\": \"");
	strcat(message, BOARD_ID);
    strcat(message, "\", \"action\": \"");
	strcat(message, ACTION_OPEN);
	strcat(message, "\" }");

	///////////////////////////
    // Publish the maintenance status
    const char* topic = RPI_MAINTENANCE_SPOT;
    client.publish(topic, message);

    String labelMessage = "..........Message published: " + String(message) + ".........." ;
    Serial.println(labelMessage);
    
    String labelTopic = "..........On topic: " + String(topic) + ".........." ;
    Serial.println(labelTopic);
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function send the data with maintenance to the server 
*/
void publishCloseDoorData() {
	///////////////////////////
    // Build the message to be published
    char message[200] = "{ \"spotID\": \"";
    strcat(message, SPOT_ID);
    strcat(message, "\", \"parkID\": \"");
	strcat(message, PARK_ID);
	strcat(message, "\", \"referenceID\": \"");
	strcat(message, BOARD_ID);
    strcat(message, "\", \"action\": \"");
	strcat(message, ACTION_CLOSE);
	strcat(message, "\" }");

	///////////////////////////
    // Publish the maintenance status
    const char* topic = RPI_MAINTENANCE_SPOT;
    client.publish(topic, message, false);

    String labelMessage = "..........Message published: " + String(message) + ".........." ;
    Serial.println(labelMessage);
    
    String labelTopic = "..........On topic: " + String(topic) + ".........." ;
    Serial.println(labelTopic);
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function receives data from publishers
*/
void callback(char* topic, byte* payload, unsigned int length) {
    String topicLabel = "..........Message received in topic:" + String(topic) + "..........";
    Serial.println(topicLabel);

	///////////////////////////
    // Checks the topic
    if (strcmp(topic, ESP32_OPEN_DOOR) == 0) {
        ///////////////////////////
        // Update the global variable with the received message
        String receivedMessage = String((char*)payload, length);
        String messageLabel = "..........Received message:" + receivedMessage + "...........";

        ///////////////////////////
        // Check if the door matches with the park
        String spotID = receivedMessage.substring(13, 14);
        String parkID = receivedMessage.substring(28, 29);

		if (isGateClosed == 1 && spotID == SPOT_ID && parkID == PARK_ID && isMaintenance == 0) {
            ///////////////////////////
            // Open the gate
            Serial.println("..........Opening the Gate..........");
            
            servoMotor.write(SERVO_MOTOR_OPENED);

            isGateClosed = 0;
			toCloseCounter = 0;
        } else {
            Serial.println("..........Keeping the Gate as it is..........");
        }

		///////////////////////////
        // Set green led
        digitalWrite(RED_LED, LOW);
        digitalWrite(GREEN_LED, HIGH);
    }
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
   This function convert a arry of bytes into a decimal number
*/
String convertByteArrayInDecimalString(byte *buffer, byte bufferSize) {
    String result = "";

    ///////////////////////////

    for (byte i = 0; i < bufferSize; i++) {
        char buf[4];
        sprintf(buf, "%d", buffer[i]);
        result += buf;
    }

    ///////////////////////////

    return result;
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/*
    This function prepare the RFID card id
*/
String getRfidCardId() {
    String id = "";

    ///////////////////////////
    // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
    if (!rfid.PICC_IsNewCardPresent()) {
        return id;
    }
    
    ///////////////////////////
    // Verify if the NUID has been readed
    if (!rfid.PICC_ReadCardSerial()) {
        return id;
    }

    ///////////////////////////
    id = convertByteArrayInDecimalString(rfid.uid.uidByte, rfid.uid.size);

    ///////////////////////////
    // Halt PICC
    rfid.PICC_HaltA();

    ///////////////////////////

    // Stop encryption on PCD
    rfid.PCD_StopCrypto1();

    return id;
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
    // Set RFID
    SPI.begin(); // Init SPI bus
    rfid.PCD_Init(); // Init MFRC522//

    ///////////////////////////
    // Set Wifi
    setupWifi();

    ///////////////////////////
    // Connecting to server
    client.setServer(MQTT_SERVER, MQTT_PORT);
    client.setCallback(callback);

    ///////////////////////////
    // Set servoMotor
    servoMotor.attach(SERVO_MOTOR);

    ///////////////////////////
    // Set PIN modes
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);

    pinMode(SPACE_DIS_IR_SENSOR, INPUT);
    
    pinMode(SPACE_DIS_US_SENSOR_TRIG, OUTPUT);
    pinMode(SPACE_DIS_US_SENSOR_ECHO, INPUT);
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
    client.loop();

    IrSensor irSensor;
    UsSensor usSensor;

    irSensor.pin = SPACE_DIS_IR_SENSOR;
    usSensor.pinTrig = SPACE_DIS_US_SENSOR_TRIG;
    usSensor.pinEcho = SPACE_DIS_US_SENSOR_ECHO;

    String cardID = getRfidCardId();
    int isSpaceOcupied = isSpaceOccupied(irSensor, usSensor); 

	///////////////////////////
	// Count time that the por is opened
	if (isSpaceOcupied == 0) {
		toCloseCounter++;
	} else {
        toCloseCounter = 0;
    }

	///////////////////////////
    // Door closing with RFID
    if (cardID == RFID_CLOSE_ID && isSpaceOcupied != 1 && isMaintenance == 1) {
        Serial.println("..........Checking if the gate can be closed..........");

		///////////////////////////
        // Close the gate
        Serial.println("..........Closing the Gate..........");

        publishCloseDoorData();

        servoMotor.write(SERVO_MOTOR_CLOSED);

        isGateClosed = 1;
        toCloseCounter = 0;
        isMaintenance = 0;
    
		///////////////////////////
        // Set red led
        digitalWrite(RED_LED, HIGH);
        digitalWrite(GREEN_LED, LOW);
    }
	
	///////////////////////////
	// Door opening with RFID
	if (cardID == RFID_OPEN_ID && isSpaceOcupied != 1 && isMaintenance == 0) {
        Serial.println("..........Checking if the gate can be opened..........");

        if (isGateClosed == 1) {
            ///////////////////////////
            // Open the gate
            Serial.println("..........Opening the Gate..........");

            publishOpenDoorData();

            servoMotor.write(SERVO_MOTOR_OPENED);

            isGateClosed = 0;
            toCloseCounter = 0;
            isMaintenance = 1;
        } else {
            Serial.println("..........Keeping the Gate as it is..........");
        }

		///////////////////////////
        // Set green led
        digitalWrite(RED_LED, LOW);
        digitalWrite(GREEN_LED, HIGH);
    } 
	
	///////////////////////////
	// Close door after X time
	if (isSpaceOcupied != 1 && isGateClosed == 0 && toCloseCounter >= TIME_TO_CLOSE && isMaintenance == 0) {
        ///////////////////////////
		// Close the gate
		Serial.println("..........Closing the Gate..........");
        
        servoMotor.write(SERVO_MOTOR_CLOSED);

		isGateClosed = 1;
        toCloseCounter = 0;

        ///////////////////////////
        // Set red led
        digitalWrite(RED_LED, HIGH);
        digitalWrite(GREEN_LED, LOW);
	} 

	///////////////////////////

    delay(1000);
}


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
