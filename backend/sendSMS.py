import requests, json
from functions import url

def sendSMS(userId, pin, otp, mobileNumber, message):
    #Header
    serviceName = 'sendSMS'
    userID = userId
    PIN = pin
    OTP = otp
    #Content
    mobileNumber = ''
    message = 'API Test'
    
    headerObj = {
                        'Header': {
                        'serviceName': serviceName,
                        'userID': userID,
                        'PIN': PIN,
                        'OTP': OTP
                        }
                        }
    contentObj = {
                        'Content': {
                        'mobileNumber': mobileNumber,
                        'message': message
                        }
                        }
    
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    
    if errorCode == '010000':
        print("SMS sent")
    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")
    else:
        print(serviceRespHeader['ErrorText'])

# sendSMS('jingyi.yeo.2020', '123456', '639967')
