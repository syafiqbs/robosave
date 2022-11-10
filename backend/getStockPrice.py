import requests, json
from functions import url

def getStockPrice(userId, pin, otp, symbol):
    #Header
    serviceName = 'getStockPrice'
    userID = userId
    PIN = pin
    OTP = otp
    #Content
    symbol = symbol
    
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
                        'symbol': symbol
                        }
                        }
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    
    if errorCode == '010000':
        stockDetail = response.json()['Content']['ServiceResponse']['Stock_Details']
        print("Volume: {}".format(stockDetail['volume']))
        print("Symbol: {}".format(stockDetail['symbol']))
        print("Price: {}".format(stockDetail['price']))
        print("Percentage Change: {}".format(stockDetail['percentageChange']))
        print("Trading Date: {}".format(stockDetail['tradingDate']))
        print("Change: {}".format(stockDetail['change']))
        print("Company: {}".format(stockDetail['company']))
        print("Prev Close: {}".format(stockDetail['prevClose']))


    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")
    else:
        print(serviceRespHeader['ErrorText'])

# getStockPrice('jingyi.yeo.2020', '123456', '354502','IBM')