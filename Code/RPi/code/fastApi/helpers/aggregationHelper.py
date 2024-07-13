##############################################################################
############################# FUNCTIONS ######################################
##############################################################################

###############################
# USER AGGREGATION PIPELINE
###############################
def get_user_aggr_pipeline(ID: str):
    pipeline = [
        {
            '$match': {
                'ID': ID
            }
        }, {
            '$lookup': {
                'from': 'Reserves', 
                'localField': 'ID', 
                'foreignField': 'userID', 
                'as': 'reserves'
            }
        }, {
            '$addFields': {
                'reserves.isOpenable': {
                    '$cond': {
                        'if': {
                            '$and': [
                                {
                                    '$gt': [
                                        '$$NOW', '$reserves.beginningTimestamp'
                                    ]
                                }, {
                                    '$lt': [
                                        '$$NOW', '$reserves.endingTimestamp'
                                    ]
                                }
                            ]
                        }, 
                        'then': True, 
                        'else': False
                    }
                }, 
                'reserves.isActive': {
                    '$cond': {
                        'if': {
                            '$and': [
                                {
                                    '$lt': [
                                        '$$NOW', '$reserves.endingTimestamp'
                                    ]
                                }
                            ]
                        }, 
                        'then': True, 
                        'else': False
                    }
                }
            }
        }, {
            '$unwind': '$reserves'
        }, {
            '$sort': {
                'reserves.startingTimestamp': -1
            }
        }, {
            '$group': {
                '_id': '$_id', 
                'data': {
                    '$first': '$$ROOT'
                }, 
                'reserves': {
                    '$push': '$reserves'
                }
            }
        }, {
            '$replaceRoot': {
                'newRoot': {
                    '$mergeObjects': [
                        '$data', {
                            'reserves': '$reserves'
                        }
                    ]
                }
            }
        }
    ]

    return pipeline
