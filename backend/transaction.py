import ctypes
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import requests, json
from functions import url

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/transaction'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Transaction(db.Model):
    __tablename__ = "transaction"
    transaction_id = db.Column(db.Integer, primary_key=True)
    transaction_date = db.Column(db.DateTime, nullable=False)
    customer_id = db.Column(db.Integer,nullable=False)
    value_before = db.Column(db.Float, nullable=False)
    value_after = db.Column(db.Float, nullable=False)
    value_roundup = db.Column(db.Float, nullable=False)

    def __init__(self, transaction_id, transaction_date, customer_id, value_before, value_after, value_roundup):
        self.transaction_id = transaction_id
        self.transaction_date = transaction_date
        self.customer_id = customer_id
        self.value_before = value_before
        self.value_after = value_after
        self.value_roundup = value_roundup
    
    def json(self):
        return {"transaction_id":self.transaction_id, "transaction_date":self.transaction_date, "customer_id":self.customer_id, "value_before":self.value_before, "value_after":self.value_after, "value_roundup":self.value_roundup}
    
# Get all transactions
@app.route("/getAllTransactions")
def get_all_transactions():
    transactionlist = Transaction.query.all()
    return jsonify(
        {
            "status":"sucess",
            "transaction":[transaction.json() for transaction in transactionlist]
        }
    )

# Insert a transaction for a customer
@app.route("/transaction", methods=["POST"])
def insert_transaction():
    data = request.get_json()

    transaction_id = data['transaction_id']
    transaction_date = data['transaction_date']
    customer_id = data['customer_id']
    value_before = data['value_before']
    value_after = data['value_after']
    value_roundup = data['value_roundup']

    transaction = Transaction(transaction_id=transaction_id, transaction_date=transaction_date, customer_id=customer_id, value_before=value_before, value_after=value_after, value_roundup=value_roundup)

    try:
        db.session.add(transaction)
        db.session.commit()
        return jsonify(
            {
                "status": "success",
                "data": transaction.json()
            }
        ), 201
    except Exception as e:
        print('failure', e)

        return jsonify(
        {
            "status": "failure",
            "message": "An error occurred creating the transaction."
        }), 500

# Call tBank billPayment API, OTP is set to '99999' to bypass
# POST request example
# {
#     "userID":"stablekwon",
#     "PIN":"000000",
#     "accountFrom":"9248",
#     "accountTo":"9253",
#     "transactionAmount":"0.5",
#     "transactionReferenceNumber":"NA",
#     "narrative":"Test"
# }
@app.route("/sendBillPayment", methods=["POST"])
def billPayment():
    data = request.get_json()
    userID = data['userID']
    PIN = data['PIN']
    accountFrom = data['accountFrom']
    accountTo = data['accountTo']
    transactionAmount = data['transactionAmount']
    transactionReferenceNumber = data['transactionReferenceNumber']
    narrative = data['narrative']

    #Content
    headerObj = {
        'Header': {
            'serviceName': 'billPayment',
            'userID': userID,
            'PIN': PIN,
            'OTP':'999999'
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
        return ("Transaction success")
        

    elif errorCode == '010041':
        return("OTP has expired.\nYou will receiving a SMS")
    else:
        return(serviceRespHeader['ErrorText'])
    
if __name__ == '__main__':
    app.run(port=5100, debug=True)