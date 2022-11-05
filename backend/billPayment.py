import requests, json
from functions import url

def billPayment(userId, pin, otp, accFrom, accTo, amt, refNo, msg):
    #Header
    serviceName = 'billPayment'
    userID = userId
    PIN = pin
    OTP = otp
    #Content
    accountFrom = accFrom
    accountTo = accTo
    transactionAmount = amt
    transactionReferenceNumber = refNo
    narrative = msg
    
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
                        'accountFrom': accountFrom,
                        'accountTo': accountTo,
                        'transactionAmount': transactionAmount,
                        'transactionReferenceNumber': transactionReferenceNumber ,
                        'narrative': narrative
                        }
                        }
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    
    if errorCode == '010000':
        ServerResponse = response.json()['Content']['ServiceResponse']
        print("Balance After Transferring: ${:.2f} ".format(float(ServerResponse['BalanceAfter']['_content_'])))
        print("Transaction ID: ", ServerResponse['TransactionID']['_content_'])
        print("Balance Before Transferring: ${:.2f}".format( float(ServerResponse['BalanceBefore']['_content_'])))
    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")  
    else:
        print(serviceRespHeader['ErrorText'])

# billPayment('jingyi.yeo.2020', '123456', '639967', '9252', '9243', '50', '3123213', 'test')