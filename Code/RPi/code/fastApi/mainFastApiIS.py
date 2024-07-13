##############################################################################
############################# GENERAL IMPORTS ################################
##############################################################################
import subprocess
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import uvicorn

from fastapi import FastAPI, Depends, HTTPException, status # type: ignore
from fastapi.security import OAuth2PasswordBearer # type: ignore
from pymongo import MongoClient # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import hashlib

from generalConfigs import *
from classes.projectClasses import *

from helpers.aggregationHelper import *

##############################################################################
############################# UTILITY IMPORTS ################################
##############################################################################
import json
import random
import string
from bson.json_util import dumps

##############################################################################
############################# GLOBAL VARIABLES ###############################
##############################################################################
# Set FastApi
app = FastAPI()

# Define the allowed origins
origins = [
    "http://localhost:4200",  # Your Angular app's URL
    # Add other allowed origins here if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers to pass
)

# Set MongoDB
mongoClient = MongoClient("mongodb+srv://" + MONGODB_USER + ":" + MONGODB_PASS + "@" + MONGODB_URL + "/")
mongoDb = mongoClient[MONGODB_DB]

# Define the OAuth2PasswordBearer instance
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

##############################################################################
############################# FASTAPI ENDPOINTS ##############################
##############################################################################

###############################
# Get Token - ENDPOINT
###############################
@app.post('/get_token')
async def get_token(tokenForm: Login):
    logins = mongoDb[MONGODB_COL_LOGINS]
    loginCursor = logins.find_one({ "ID": tokenForm.ID, "password": hashlib.sha256(tokenForm.password.encode()).hexdigest() })

    loginData = dumps(loginCursor)

    loginJson = json.loads(loginData)
    
    if loginJson and loginJson["isAdmin"] == True:
        ######################
        # Success message
        return {
            "success": True,
            "token": loginJson["token"]
        }
    
    ######################
    # Error message
    return {
        "success": False,
        "message": "Error generating the token"
    }


###############################
# Validate Token - Function
###############################
def validate_token(token: str = Depends(oauth2_scheme)):
    logins = mongoDb[MONGODB_COL_LOGINS]

    tokenCursor = logins.find_one({ "token": token })
    tokenData = dumps(tokenCursor)

    tokenJson = json.loads(tokenData)

    if tokenJson and tokenJson["token"] == token:
        return True
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


###############################
# Create User - ENDPOINT 
# Token dependent
###############################
@app.post('/create_user')
async def create_user(user: User, allowed = Depends(validate_token)):
    if allowed:
        logins = mongoDb[MONGODB_COL_LOGINS]
        users = mongoDb[MONGODB_COL_USERS]

        ######################
        # There is a user with the same email
        existingUser = logins.find_one({ "ID": user.ID })

        if existingUser: 
            return {
                "success": False,
                "message": "The user already exists!"
            }

        try:
            ######################
            # The user token
            generatedToken = string.ascii_letters + string.digits
            generatedToken = ''.join(random.choices(generatedToken, k=200))

            ######################
            # The user can be crated
            userJson = {
                "ID": user.ID,
                "firstName": user.firstName,
                "lastName": user.lastName, 
                "phoneNumber": user.phoneNumber,
                "password": hashlib.sha256(user.password.encode()).hexdigest(),
                "isHandicap": False,
                "isAdmin": False,
                "address": user.address,
                "vehicle": {
                    "registrationPlate": user.vehicle.registrationPlate,
                    "vehicleBrand": user.vehicle.vehicleBrand,
                    "vehicleType": user.vehicle.vehicleType,
                    "vehicleFuel": user.vehicle.vehicleFuel
                }
            }

            loginJson = {
                "ID": user.ID,
                "password": hashlib.sha256(user.password.encode()).hexdigest(),
                "isActive": True,
                "isAdmin": False,
                "token": generatedToken
            }

            ######################
            # Insert login & user 
            logins.insert_one(loginJson)
            users.insert_one(userJson)
        except ZeroDivisionError:
            return {
                "success": False,
                "message": "The user could not be created!"
            }
        
        ######################
        # Success message
        return {
            "success": True,
            "message": "The user was created!"
        }


###############################
# USER TOKEN - ENDPOINT
# Token dependent
###############################
@app.post('/get_user')
async def get_user(user: UserSimplified, allowed = Depends(validate_token)):
    if allowed:
        users = mongoDb[MONGODB_COL_USERS]

        aggregation = users.aggregate(get_user_aggr_pipeline(user.ID))

        aggregationList = list(aggregation)
        aggregationData = dumps(aggregationList)

        result = json.loads(aggregationData)
        
        if result:
            ######################
            # Success message
            return {
                "success": True,
                "result": result[0]
            }
        else:
            userCursor = users.find_one({ "ID": user.ID })

            userData = dumps(userCursor)

            userJson = json.loads(userData)
            
            if userJson:
                userJson["reserves"] = []
                
                ######################
                # Success message
                return {
                    "success": True,
                    "result": userJson
                }
        
        ######################
        # Error message
        return {
            "success": False,
            "message": "No user found!"
        }


###############################
# Login User - ENDPOINT 
# Token dependent
###############################
@app.post('/login')
async def login_user(login: Login, allowed = Depends(validate_token)):
    if allowed:
        logins = mongoDb[MONGODB_COL_LOGINS]

        ######################
        # There is a login with the email & password
        existingLogin = logins.find_one({ "ID": login.ID, "password": hashlib.sha256(login.password.encode()).hexdigest() })

        if existingLogin and existingLogin["isActive"] == True:
            ######################
            # Success message
            return {
                "success": True,
                "message": "Allowed to login!"
            }
        
        ######################
        # Error message
        return {
            "success": False,
            "message": "Email or password wrong!"
        }


###############################
# Create User - ENDPOINT 
# Token dependent
###############################
@app.post('/create_reserve')
async def create_reserve(reserve: Reserve, allowed = Depends(validate_token)):
    if allowed:
        logins = mongoDb[MONGODB_COL_LOGINS]
        reserves = mongoDb[MONGODB_COL_RESERVES]

        ######################
        # There is a user with the same email
        existingUser = logins.find_one({ "ID": reserve.userID })

        if existingUser: 
            ######################
            # Check for a reserve with the same time
            query = {
                "$and": [
                    {"beginningTimestamp": {"$lte": reserve.beginningTimestamp}},
                    {"endingTimestamp": {"$gte": reserve.beginningTimestamp}},
                    {"parkID": reserve.parkID},
                    {"spotID": reserve.spotID},
                    {"userID": reserve.userID}
                ]
            }

            existingReserve = reserves.find_one(query)

            if existingReserve:
                ######################
                # Error message
                return {
                    "success": False,
                    "message": "The reserve already exists!"
                }

            try:
                ######################
                # The reserve can be crated
                reserveJson = {
                    "beginningTimestamp": reserve.beginningTimestamp,
                    "endingTimestamp": reserve.beginningTimestamp,
                    "parkID": reserve.parkID,
                    "spotID": reserve.spotID,
                    "userID": reserve.userID
                }

                ######################
                # Insert reserve
                reserves.insert_one(reserveJson)
            except Exception:
                return {
                    "success": False,
                    "message": "The reserve could not be created!"
                }
            
            #######################
            ## Success message
            return {
                "success": True,
                "message": "The reserve was created!"
            }

        ######################
        # Error message
        return {
            "success": False,
            "message": "The reserve does not exist!"
        }

        
###############################
# Get Park - ENDPOINT 
# Token dependent
###############################
@app.post('/get_park')
async def get_park(park: Park, allowed = Depends(validate_token)):
    if allowed:
        parks = mongoDb[MONGODB_COL_PARKS]

        ######################
        # There is a user with the same email
        parkCursor = parks.find_one({ "ID": park.ID })
        parkData = dumps(parkCursor)

        parkJson = json.loads(parkData)

        if parkJson: 
            #######################
            ## Success message
            return {
                "success": True,
                "result": parkJson
            }

        ######################
        # Error message
        return {
            "success": False,
            "message": "The park does not exist!"
        }


###############################
# Get Parks - ENDPOINT 
# Token dependent
###############################
@app.post('/get_parks')
async def get_parks(allowed = Depends(validate_token)):
    if allowed:
        parks = mongoDb[MONGODB_COL_PARKS]

        ######################
        # There is a user with the same email
        parkCursor = parks.find()
        parlList = list(parkCursor)
        parkData = dumps(parlList)

        parkJson = json.loads(parkData)

        if parkJson: 
            #######################
            ## Success message
            return {
                "success": True,
                "result": parkJson
            }

        ######################
        # Error message
        return {
            "success": False,
            "message": "The park does not exist!"
        }
        
        
###############################
# Get Update Archive - ENDPOINT 
# Token dependent
###############################
@app.post('/get_update_archive')
async def get_update_archive(allowed = Depends(validate_token)):
    if allowed:
        archive = mongoDb[MONGODB_COL_UPDATES]

        ######################
        #The first 20 update archive
        archiveCursor = archive.find().limit(20)
        archiveList = list(archiveCursor)
        archiveData = dumps(archiveList)

        archiveJson = json.loads(archiveData)

        if archiveJson: 
            #######################
            ## Success message
            return {
                "success": True,
                "result": archiveJson
            }

        ######################
        # Error message
        return {
            "success": False,
            "message": "The update does not exist!"
        }
        
        
###############################
# Get Parks - ENDPOINT 
# Token dependent
###############################
@app.post('/get_maintenance_archive')
async def get_maintenance_archive(allowed = Depends(validate_token)):
    if allowed:
        archive = mongoDb[MONGODB_COL_MAINTENANCE]

        ######################
        # The first 20 maintenance archive
        archiveCursor = archive.find().limit(20)
        archiveList = list(archiveCursor)
        archiveData = dumps(archiveList)

        archiveJson = json.loads(archiveData)

        if archiveJson: 
            #######################
            ## Success message
            return {
                "success": True,
                "result": archiveJson
            }

        ######################
        # Error message
        return {
            "success": False,
            "message": "The maintenance does not exist!"
        }


##############################################################################
############################# HTTP + MQTT ENDPOINTS ##########################
##############################################################################

###############################
# Open door - ENDPOINT 
# Token dependent
###############################
@app.post('/open_door')
async def open_door(spot: Spot, allowed = Depends(validate_token)):
    if allowed:
        import paho.mqtt.client as mqtt # type: ignore

        try:            
            #######################
            # THIS CODE MUST BE CHANGED TO CALL THE SERVIENT CLIENT 
            #######################
            
            #######################
            # Create a new MQTT client instance
            client = mqtt.Client()

            #######################
            # Connect to the broker
            
            client.connect(MQTT_SERVER, MQTT_PORT)
            client.username_pw_set(MQTT_USER, MQTT_PASS)
            
            msg = '{ "spotID": "' + spot.spotID + '", "parkID": "' + spot.parkID + '" }'

            #######################
            # Start the client loop
            client.loop_start()

            pubMsg = client.publish(
                topic = ESP32_OPEN_DOOR,
                payload = msg.encode('utf-8'),
                qos = 1
            )

            pubMsg.wait_for_publish()
            
            #######################
            # Start the client loop
            client.loop_stop()

            #######################
            # Disconnect from the broker
            client.disconnect()

            #######################
            ## Success message
            return {
                "success": True,
                "result": "The door was asked to be opened!"
            }
        except Exception as e:
            print(e)
            ######################
            # Error message
            return {
                "success": False,
                "message": "The door can not be opened!"
            }

