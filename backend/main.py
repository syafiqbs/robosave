from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import extract  
import re
import requests, json
from functions import url



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/robosave'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Customer(db.Model):
    __tablename__ = "customer"
    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(30), nullable=False)
    customer_bankNo = db.Column(db.Integer, nullable=False)

    def __init__(self, customer_id, customer_name, customer_bankNo):
        self.customer_id = customer_id
        self.customer_name = customer_name
        self.customer_bankNo = customer_bankNo

    def json(self):
        return {"customer_id":self.customer_id, "customer_name":self.customer_name, "customer_bankNo":self.customer_bankNo}

class Transaction(db.Model):
    __tablename__ = "transaction"
    transaction_id = db.Column(db.Integer, primary_key=True)
    txn_date = db.Column(db.DateTime, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.customer_id'))
    value_before = db.Column(db.Float, nullable=False)
    value_after = db.Column(db.Float, nullable=False)
    value_roundup = db.Column(db.Float, nullable=False)

    def __init__(self, transaction_id, txn_date, customer_id, value_before, value_after, value_roundup):
        self.transaction_id = transaction_id
        self.txn_date = txn_date
        self.customer_id = customer_id
        self.value_before = value_before
        self.value_after = value_after
        self.value_roundup = value_roundup
    
    def json(self):
        return {"transaction_id":self.transaction_id, "txn_date":self.txn_date, "customer_id":self.customer_id, "value_before":self.value_before, "value_after":self.value_after, "value_roundup":self.value_roundup}

class Roundup(db.Model):
    __table__name = "roundup"
    roundup_date = db.Column(db.DateTime, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("transaction.customer_id"), primary_key=True)
    total = db.Column(db.Float, nullable=False)
    
    def __init__(self, roundup_date, customer_id, total ):
        self.roundup_date = roundup_date
        self.customer_id = customer_id
        self.total = total
    
    def json(self):
        return {"roundup_date":self.roundup_date, "customer_id":self.customer_id, "total":self.total}

## Get all customers
@app.route("/customer")
def get_all_customer():
    customerlist = Customer.query.all()
    return jsonify(
        {
            "status":"sucess",
            "customer":[customer.json() for customer in customerlist]
        }
    )

# Insert a transaction for a customer
@app.route("/transaction", methods=["POST"])
def insert_transaction():
    data = request.get_json()

    transaction_id = data['transaction_id']
    txn_date = data['txn_date']
    customer_id = data['customer_id']
    value_before = data['value_before']
    value_after = data['value_after']
    value_roundup = data['value_roundup']

    transaction = Transaction(transaction_id=transaction_id, txn_date=txn_date, customer_id=customer_id, value_before=value_before, value_after=value_after, value_roundup=value_roundup)

    try:
        db.session.add(transaction)
        db.session.commit()
    except Exception as e:
        print('failure', e)

        return jsonify(
        {
            "status": "failure",
            "message": "An error occurred creating the transaction."
        }), 500

# Get round up by month
@app.route("/roundup/<string:customer_id>/<string:month>")
def get_round_by_month(customer_id, month):

    roundup = db.session.query(db.func.sum(Transaction.value_roundup)).filter(extract('month', Transaction.txn_date)==month).filter_by(customer_id=customer_id).all()
    roundup = re.findall("\d+\.\d+", str(roundup))

    return jsonify(
        {
            "status":"sucess",
            "roundup":roundup
        }
    )

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
    




if __name__ == '__main__':
    app.run(port=5000, debug=True)