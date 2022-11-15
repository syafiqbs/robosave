import requests, json
from functions import url

def placeMarketOrder(userID, PIN, OTP, settlementAccount, symbol, buyOrSell, quantity):
    #Header
    serviceName = 'placeMarketOrder'
    # userID = 'alan'
    # PIN = '987654'
    # OTP = '987654'
    # #Content
    # settlementAccount = '76'
    # symbol = 'TSLA'
    # buyOrSell = 'buy'
    # quantity = '20'
    
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
                        'settlementAccount': settlementAccount,
                        'symbol': symbol,
                        'buyOrSell': buyOrSell,
                        'quantity': quantity
                        }
                        }
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    
    if errorCode == '010000':
        marketOrder = response.json()['Content']['ServiceResponse']['StockOrder']
        print("You have successfully placed a market order. The order ID is {}.".format(marketOrder['orderID']))
        return ['success', marketOrder['orderID']]

    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")
    else:
        return serviceRespHeader['ErrorText']

# print(placeMarketOrder('stablekwon', '000000', '999999', '9248', 'AAPL', 'buy', '1'))
