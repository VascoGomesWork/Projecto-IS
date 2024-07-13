##############################################################################
############################# BROKER #########################################
##############################################################################

#############################
# BOARD ID
CLIENT_NAME             = 'RPI'
BOARD_REFERENCE_ALLOWED = ['sp85iugpr3', 'xlzg9s0zg6', '3zx10tutr8'] 

#############################
# ENDPOINTS ALLOWED
ESP32_OPEN_DOOR         = 'esp32/open_door'
RPI_UPDATE_SPOTS        = 'rpi/update_spots'
RPI_UPDATE_SPOTS_NODE	= 'rpi/update_spots_node'
RPI_MAINTENANCE_SPOT    = 'rpi/maintenance_spot'

#############################
# SERVER DETAILS
MQTT_SERVER             = '192.168.1.83'
MQTT_PORT               = 1884
MQTT_USER				= 'park'
MQTT_PASS				= 'park123'

##############################################################################
############################# CONSTANT DEF ###################################
##############################################################################

MONGODB_USER            = "joaomrpica"
MONGODB_PASS            = "rVpKLRDeowQHglgR"
MONGODB_URL             = "parklookup-cluster.btzxebu.mongodb.net"
MONGODB_DB              = "ParkLookUp"
MONGODB_COL_LOGINS      = "Logins"
MONGODB_COL_USERS       = "Users"
MONGODB_COL_PARKS       = "Parks"
MONGODB_COL_RESERVES    = "Reserves"
MONGODB_COL_MAINTENANCE = "MaintenanceArchive"
MONGODB_COL_UPDATES     = "UpdateArchive"
