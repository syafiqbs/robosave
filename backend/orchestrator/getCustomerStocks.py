import requests, json
from functions import url,getRecord
from getStockSymbols import getStockSymbols

def getCustomerStocks(userID, PIN, OTP):
    #Header
    serviceName = 'getCustomerStocks'
    # userID = 'KelvanTan'
    # PIN = '000000'
    # OTP = '000000'
    
    headerObj = {
                        'Header': {
                        'serviceName': serviceName,
                        'userID': userID,
                        'PIN': PIN,
                        'OTP':OTP
                        }
                        }
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)
    print(response)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        depository_list = response.json()['Content']['ServiceResponse']['DepositoryList']
        if depository_list == {}:
            return "No record found!"
        else:
            depository_list = depository_list['Depository']
            return depository_list
                    
    elif errorCode == '010041':
        return "OTP has expired.\nYou will receiving a SMS"
    else:
        return serviceRespHeader['ErrorText']

# getCustomerStocks('T0021535', '485689', '999999')         
