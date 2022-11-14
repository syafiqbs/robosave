from flask import Flask, request, jsonify
from flask_cors import CORS
from functions import url
import requests
from invokes import invoke_http
import os, sys
from os import environ
import json
from billPayment import billPayment
from placeMarketOrder import placeMarketOrder
from getBillingOrganisations import getBillingOrganizations
import math
from datetime import datetime
from getStockPrice import getStockPrice
from getCustomerAccounts import getCustomerAccounts

app = Flask(__name__)
CORS(app)

transaction_URL = "http://localhost:5100/"
roundup_URL = "http://localhost:5002/"
customer_URL = "http://localhost:5001/"

#Authentication
@app.route("/OTP", methods=["POST"])
def requestOTP():
   data = request.get_json() 
   userID = data['userID']
   pin = data['pin']
   
   headerObj = {
    'Header': {
        'serviceName': 'requestOTP',
        'userID': userID,
        'PIN': pin,
        }

    }
   final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
   response = requests.post(final_url)
   serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
   errorCode = serviceRespHeader['GlobalErrorID']

   if errorCode == '010000':
    dic = {0:'01000', 1:'OTP Sent'}
    return dic
   elif errorCode == '010041':
    dic = {0:'010041', 1:'OTP has expired.\nYou will receiving a SMS'}
    return dic
   else:
    dic = {0: errorCode, 1:serviceRespHeader['ErrorDetails']}
    return dic
    

#Process payment
@app.route("/pay", methods=["POST"])
def pay():
        # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            transactionRecord = request.get_json()
            print("\nReceived a transaction record in JSON:", transactionRecord)
            customerAccDetails = getCustomerAccounts(transactionRecord['userID'],transactionRecord['pin'],  transactionRecord['otp'])
            account = False
            for acc in customerAccDetails:
                if int(acc['accountID']) == int(transactionRecord['accountFrom']):
                    account= acc
            if account:
                if float(account['balance']) >= float(transactionRecord['transactionAmount']):
                    result= billPayment(transactionRecord['userID'], transactionRecord['pin'], transactionRecord['otp'], transactionRecord['accountFrom'],transactionRecord['accountTo'], transactionRecord['transactionAmount'], transactionRecord['narrative'])
                    print(result)
                    if result[0]== 200:  
                        transResult=processTransactionAdd(transactionRecord, result[1]['transactionID'])
                        return transResult
                    return "error"
                return "Insufficient funds."
            return "No account found."

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            # print(ex_str)

            return jsonify({
                "code": 500,
                "message": "main.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400
    
def processTransactionAdd(transactionRecord, transactionID):
    # Invoke the transaction microservice
    print('\n-----Invoking transaction microservice-----')
    date_today = datetime.now()
    value_before = float(transactionRecord['transactionAmount'])
    value_after =math.ceil(float(transactionRecord['transactionAmount']))
    value_roundup = value_after - value_before
    customer_id = transactionRecord['userID']
    transactionJSON= json.dumps({'transaction_id': transactionID, 'transaction_date': str(date_today), 'customer_id':customer_id, 'value_before':value_before, 'value_after': value_after,  'value_roundup':value_roundup })

    record_result = invoke_http(transaction_URL+"transaction", method='POST', json=json.loads(transactionJSON))
    # print('record_result:', record_result)
    transaction_stat = record_result['status']
    if transaction_stat != 'success':
        # Return error
        return {
            "code": 500,
            "data": {"record_result": record_result},
            "message": "Transaction creation failure."
        }
        
    # Invoke the roundup microservice
    print('\n-----Invoking roundup microservice-----')
    
    roundup_month = date_today.strftime("%m-%Y")
    roundupJSON= json.dumps({'roundup_date': roundup_month,'customer_id': customer_id, 'roundup_value': value_roundup })
    roundup_result = invoke_http(roundup_URL+ "getRoundupByMY/"+ str(customer_id) +'/'+ str(roundup_month), method='GET')
    # print('roundup_result:', roundup_result)
    if roundup_result['code'] not in range(200,300):
        roundup_create = invoke_http(roundup_URL+ "createRoundup", method='POST', json=json.loads(roundupJSON))
        roundup_stat = roundup_create['code']
        if roundup_stat not in range(200,300):
            # Return error
            return {
                "code": 500,
                "data": {"roundup_result": roundup_create},
                "message": "Roundup update failure."
            }
        
        return {
        "code": 201,
        "data": {
            "record_result": record_result,
            "roundup_result": roundup_create
        }
        }
    else:
        roundup_update = invoke_http(roundup_URL+ "updateRoundup/"+ str(customer_id) +'/'+ str(roundup_month), method='PUT', json=json.loads(roundupJSON))
        roundup_stat = roundup_update['code']
        if roundup_stat not in range(200,300):
            # Return error
            return {
                "code": 500,
                "data": {"roundup_result": roundup_update},
                "message": "Roundup update failure."
            }
        
        return {
        "code": 201,
        "data": {
            "record_result": record_result,
            "roundup_result": roundup_update
        }
        }
    
#invest
@app.route("/invest", methods=["POST"]) #Requires customer_id, pin, otp
def invest():
    customer_details= request.get_json()
    customer_record = invoke_http(customer_URL+ "customer/"+ str(customer_details['customer_id']), method='GET')
    if customer_record['status'] == 'success':
        currentMonth = str(datetime.now().month) #Choose month
        currentYear = str(datetime.now().year) #Choose year
        customer_bank = customer_record['customer']["customer_bankNo"]
        customer_roundup = invoke_http(roundup_URL+ "getRoundupByMY/"+ str(customer_details['customer_id']) +"/" + str(currentMonth+"-" + currentYear), method='GET')
        roundupTotal = customer_roundup['data']['total']
    symbol = "IBM"
    stockPrice = getStockPrice(customer_details['customer_id'], customer_details['pin'], customer_details['otp'], symbol)
    stockQty = int(roundupTotal/float(stockPrice))
    orderID = placeMarketOrder(customer_details['customer_id'], customer_details['pin'], '999999', customer_bank, symbol, 'buy', stockQty)
    print(roundupTotal)
    return jsonify(
        {
            "status":"success",
            "orderID": orderID
        }
    )

#billingorg
@app.route("/billingorg", methods=["GET"])
def billingorg():
    result = getBillingOrganizations()
    return result

if __name__ == '__main__':
    app.run(port=5000, debug=True)