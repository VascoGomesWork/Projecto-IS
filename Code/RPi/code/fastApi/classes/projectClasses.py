##############################################################################
############################# GENERAL IMPORTS ################################
##############################################################################
from pydantic import BaseModel

##############################################################################
############################# CLASS LISTING ##################################
##############################################################################

######################
# Vehicle model
class Vehicle(BaseModel):
    registrationPlate: str
    vehicleBrand: str
    vehicleType: str
    vehicleFuel: str

######################
# User model
class User(BaseModel):
    ID: str
    password: str
    firstName: str
    lastName: str
    phoneNumber: str
    address: str
    isAdmin: bool
    vehicle: Vehicle

######################
# User model - simplified
class UserSimplified(BaseModel):
    ID: str

######################
# User model
class Login(BaseModel):
    ID: str
    password: str

######################
# Reserve model
class Reserve(BaseModel):
    userID: str
    spotID: str
    parkID: str
    beginningTimestamp: str
    endingTimestamp: str

######################
# Park model
class Park(BaseModel):
    ID: str

######################
# Spot model
class Spot(BaseModel):
    spotID: str
    parkID: str
