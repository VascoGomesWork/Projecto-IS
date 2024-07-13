##############################################################################
############################# GENERAL IMPORTS ################################
##############################################################################
from fastapi import FastAPI, File, UploadFile # type: ignore
from roboflow import Roboflow # type: ignore

##############################################################################
############################# GLOBAL VARIABLES ###############################
##############################################################################
# Set FastApi
app = FastAPI()

# Set RoboFlow model
rf = Roboflow(api_key="mEH4tEWrgG67sW5a7n9f")
project = rf.workspace().project("100imagesparking")
model = project.version(3).model

# Directory
IMAGEDIR = "images/"

##############################################################################
############################# FASTAPI ENDPOINTS ##############################
##############################################################################

###############################
# Image Handler - ENDPOINT
###############################
@app.post('/handle_image')
async def open_door(file: UploadFile = File(...)):
    try:
        ######################
        # Get the file
        contents = await file.read()

        ######################
        # Save the file
        with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
            f.write(contents)
 

        ######################
        # Process model
        result = model.predict(IMAGEDIR + file.filename, confidence=80, overlap=30).json()

        ######################
        # Success message
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        print(e)
        ######################
        # Error message
        return {
            "success": False,
            "message": "The image could not be processed!"
        }
        