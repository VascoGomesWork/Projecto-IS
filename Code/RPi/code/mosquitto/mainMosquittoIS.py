##############################################################################
############################# GENERAL IMPORTS ################################
##############################################################################
import sys
import os
import requests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import paho.mqtt.client as mqtt # type: ignore
from pymongo import MongoClient # type: ignore
from picamera import PiCamera

from generalConfigs import *

##############################################################################
############################# UTILITY IMPORTS ################################
##############################################################################
import json
import time
from datetime import datetime

##############################################################################
############################# GLOBAL VARIABLES ###############################
##############################################################################
# Set MongoDB
mongoClient = MongoClient("mongodb+srv://" + MONGODB_USER + ":" + MONGODB_PASS + "@" + MONGODB_URL + "/")
mongoDb = mongoClient[MONGODB_DB]

##############################################################################
############################# BROKER FUNCTIONS ###############################
##############################################################################

# Function that will triggered when the client
# connects
def on_connect(client, userdata, flags, rc):
    global flag_connected
    flag_connected = 1
    
    ######################
    # Sync subscriptions
    client_subscriptions(client)

###############################################################

###############################################################
# Function trigger on diconnect
#############################
def on_disconnect(client, userdata, rc):
    global flag_connected
    flag_connected = 0
   
###############################################################
# Function that will update the status 
# of each parking space in BD
# PAYLOAD:
#   '{ "parkID": "2", "spots": [ { "isOccupied": false, , "spotID": "1" }], "referenceID": "sp85iugpr3"}'
#############################
def update_spots(client, userdata, msg):
    try:
        updateArchive = mongoDb[MONGODB_COL_UPDATES]
        parks = mongoDb[MONGODB_COL_PARKS]

        ######################
        # Prepare payload message
        msgPayload = str(msg.payload.decode('utf-8'))
        msgPayloadObj = json.loads(msgPayload)
        
        ######################
        # Take a photo of the park
        camera = PiCamera()
        camera.rotation = 180
        camera.start_preview()
        time.sleep(1)
        camera.capture('/home/joaopica/Desktop/Trabalho_IS_WC/IS_WC/code/mosquitto/images/parking_image.jpg')
        camera.stop_preview()
        camera.close()
        
        ######################
        # Call api to process image
        f = open('images/parking_image.jpg', 'rb')

        files = {"file": ("parking_image.jpg", f)}

        result = requests.post("https://fast-api-parklookup.onrender.com/handle_image", files=files).json()
        
        resultData = result['data']
        
        ######################
        # Add image processed info to json object
        spots = [
                    ('4', (445, 545), (390, 490)), ('5', (692, 792), (390, 490)), ('6', (934, 1034), (390, 490)), ('7', (1174, 1274), (390, 490)),
                    ('8', (445, 545), (695, 795)), ('9', (692, 792), (695, 795)), ('10', (934, 1034), (695, 795)), ('11', (1174, 1274), (695, 795))
                ]
        
        cameraSpots = [
            {'spotID': '4', 'isOccupied': True},
            {'spotID': '5', 'isOccupied': True},
            {'spotID': '6', 'isOccupied': True},
            {'spotID': '7', 'isOccupied': True},
            {'spotID': '8', 'isOccupied': True},
            {'spotID': '9', 'isOccupied': True},
            {'spotID': '10', 'isOccupied': True},
            {'spotID': '11', 'isOccupied': True}
        ]

        if (resultData):
            for spot in spots:
                for prediction in resultData['predictions']:
                    if (prediction['x'] >= spot[1][0] and prediction['x'] <= spot[1][1] and prediction['y'] >= spot[2][0] and prediction['y'] <= spot[2][1]):
                        for cameraSpot in cameraSpots:
                            if (cameraSpot['spotID'] == spot[0] and prediction['class'] == '0'):
                                cameraSpot['isOccupied'] = False
                        
        joinedParks = msgPayloadObj['spots'] + cameraSpots          
        msgPayloadObj['spots'] = joinedParks
        
        print( msgPayloadObj['spots'] )

        ######################
        # Send data to database
        if msgPayloadObj['referenceID'] in BOARD_REFERENCE_ALLOWED:
            ######################
            # Insert update 
            updateArchive.insert_one(msgPayloadObj)

            ######################
            # Update the parking spot
            for spot in msgPayloadObj['spots']:
                
                query1 = {
                    "ID": msgPayloadObj['parkID']
                }
                
                isOccupied = False
            
                if spot['isOccupied'] == True:
                    isOccupied = True
                
                
                query2 = {
                    "$set": {
                        "spots.$[elem].isOccupied": isOccupied
                    }
                }

                query3 = [{"elem.spotID": spot['spotID']}]

                parks.update_one(query1, query2, array_filters = query3)
    except Exception as e:
        print(e)

###############################################################
# Function that will update the status of a 
# maintenance spot 
# PAYLOAD:
#   '{ "spotID": "1", "parkID": "2", "referenceID": "sp85iugpr3", "action": "OPEN|CLOSE"}'
#############################
def update_maintenance_spot(client, userdata, msg):
    try:
        maintenanceArchive = mongoDb[MONGODB_COL_MAINTENANCE]
        reserves = mongoDb[MONGODB_COL_RESERVES]
        parks = mongoDb[MONGODB_COL_PARKS]
        
        ######################
        # Prepare payload message
        msgPayload = str(msg.payload.decode('utf-8'))
        msgPayloadObj = json.loads(msgPayload)

        if msgPayloadObj['referenceID'] in BOARD_REFERENCE_ALLOWED:
            ######################
            # Insert update 
            maintenanceArchive.insert_one(msgPayloadObj)

            ######################
            # Update the parking spot
            query1 = {
                "ID": msgPayloadObj['parkID']
            }
            
            isMaintenance = False
            
            if msgPayloadObj['action'] == "OPEN":
                isMaintenance = True
            

            query2 = {
                "$set": {
                    "spots.$[elem].isMaintenance": isMaintenance
                }
            }

            query3 = [{"elem.spotID": msgPayloadObj['spotID']}]

            parks.update_one(query1, query2, array_filters = query3)

            ######################
            # Update the user reserverpi/update_spots
            current_time = datetime.utcnow().isoformat() 

            query4 = {
                "spotID": msgPayloadObj['spotID'],
                "parkID": msgPayloadObj['parkID'],
                "endingTimestamp": {"$gt": current_time}
            }

            reserves.delete_many(query4)
    except Exception as e:
        print(e)

###############################################################
###############################################################

# Function that will update the status 
# of each parking space
def client_subscriptions(client):
    client.subscribe(RPI_UPDATE_SPOTS)
    client.subscribe(RPI_MAINTENANCE_SPOT)

###############################################################
###############################################################
# MAIN

#############
# Client set up
client = mqtt.Client()
client.username_pw_set(MQTT_USER, MQTT_PASS)

global flag_connected
flag_connected = 0

#############
# Connection functions
client.on_connect = on_connect
client.on_disconnect = on_disconnect

#############
# Subscriptions
client.message_callback_add(RPI_UPDATE_SPOTS, update_spots)
client.message_callback_add(RPI_MAINTENANCE_SPOT, update_maintenance_spot)
client.connect(MQTT_SERVER, MQTT_PORT)

#############
# Start a new thread
client.loop_start()
client_subscriptions(client)

while True:
    if flag_connected == 0:
        print('Connection Down!')
    else:
        print('Connection Up!')
    
    time.sleep(6)
    

###############################################################

