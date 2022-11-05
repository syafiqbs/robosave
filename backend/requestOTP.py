import requests, json
from functions import url

def requestOTP(userId, pin):
    OTP = '', 
    PIN = pin,
    serviceName = 'requestOTP',
    userID = userId

    headerObj = {
                            'Header': {
                            'serviceName': serviceName,
                            'userID': userID,
                            'PIN': PIN,
                            'OTP': OTP
                            }
                            }

    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        print("OTP Sent")

    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")

    else:
        print(serviceRespHeader['ErrorText'])

# requestOTP('jingyi.yeo.2020', '123456')