from asyncio.windows_events import NULL
import ctypes
import json
import traceback
from venv import create
from flask import Flask, request, jsonify, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import requests, json
from functions import url
from getCustomerTypes import getCustomerTypes
from getProductTypes import getProductTypes

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/customer'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Customer(db.Model):
    __tablename__ = "customer"
    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(64), nullable=False)
    customer_bankNo = db.Column(db.Integer, nullable=False)

    def __init__(self, customer_id, customer_name, customer_bankNo):
        self.customer_id = customer_id
        self.customer_name = customer_name
        self.customer_bankNo = customer_bankNo

    def json(self):
        return {"customer_id":self.customer_id, "customer_name":self.customer_name, "customer_bankNo":self.customer_bankNo}
    
    
@app.route("/customer") #GET request to get all customers
def get_all_customers():
    customerlist = Customer.query.all()
    return jsonify(
        {
            "status":"success",
            "customer":[customer.json() for customer in customerlist]
        }
    )

@app.route("/customer/<string:customer_id>") #GET request to get a specific customer
def get_customer(customer_id):
    customer = Customer.query.filter_by(customer_id = customer_id).first()
    try :
        return jsonify(
            {
                "status":"success",
                "customer": customer.json()
            }
        )
    except Exception:
        return NULL

@app.route("/customer", methods = ["POST"]) #POST request to create new customer 
def create_customer():
    data = request.get_json()
    newCustomer = Customer(**data)
    try:
        db.session.add(newCustomer)
        db.session.commit()
        return jsonify({
            "message": "success"
        }), 201
    except Exception:
        return jsonify({
            "message": "Unable to commit to database."
        }), 500

@app.route("/customer/update/<string:customer_id>", methods=['PUT']) # UPDATE of existing customer!
def update_customer(customer_id):
    data = request.get_json()
    customer_to_update = Customer.query.filter_by(customer_id = customer_id).first()
    try:
        customer_to_update.customer_id = data['customer_id']
        customer_to_update.customer_Name = data['customer_name']
        customer_to_update.customer_bankNo = data['customer_bankNo']
        db.session.commit()
        return jsonify({"message" : "Customer updated successfully!"})

        
    except Exception:
        return jsonify({
            "message" : "Customer not found! You screwed up big time!"
        }), 500

@app.route("/customer/delete/<string:customer_id>", methods=['DELETE']) # DELETE existing customer!
def delete_customer(customer_id):
    customer_to_delete = Customer.query.filter_by(customer_id = customer_id).first()
    
    try:
        db.session.delete(customer_to_delete)
        db.session.commit()
        return jsonify({"message" : "Customer deleted successfully"})
        
    except Exception:
        return jsonify({
            "message" : "Customer not found!"
        }), 500

@app.route("/customerdetails") #GET request to retrieve customer details
def getCustomerDetails():
    #Header
    data = request.get_json()
    serviceName = 'getCustomerDetails'
    userID = data['userID']
    PIN = data['PIN']
    OTP = data['OTP']
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
        CDMCustomer = response.json()['Content']['ServiceResponse']['CDMCustomer']
        return CDMCustomer
    elif errorCode == '010041':
        return "OTP has expired.\nYou will receiving a SMS"
    else:
        return serviceRespHeader['ErrorText']

@app.route("/customeraccount") # GET request to returns customer accounts
def getCustomerAccounts():
    #Header
    data = request.get_json()
    serviceName = 'getCustomerAccounts'
    userID = data['userID']
    PIN = data['PIN']
    OTP = data['OTP']
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
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    if errorCode == '010000':
        acc_list = response.json()['Content']['ServiceResponse']['AccountList']
        if acc_list == {}:
            return "No record found!"
        else:
            return acc_list
    elif errorCode == '010041':
        return "OTP has expired.\nYou will receiving a SMS"
    else:
        return serviceRespHeader['ErrorText']

@app.route("/checkExisting")
def checkifexists(): 
    data = request.get_json()
    userID = data['userID']
    customerDetails = requests.get(url_for("getCustomerDetails", _external = True), json = data)
    customerAccounts = requests.get(url_for("getCustomerAccounts", _external = True), json = data)
    customerName = customerDetails.json()['givenName']
    customerBankNo = customerAccounts.json()['account'][0]['accountID']
    if (get_customer(userID)): # checks if customer has robosave account
        return {
            "customerDetails" : customerDetails.json(),
            "customerAccounts" : customerAccounts.json(),
            'message' : "Existing account"
        }
    else:
        data = {'customer_id': userID, 'customer_name' : customerName, 'customer_bankNo' : customerBankNo}
        isCreated = requests.post(url_for("create_customer", _external = True), json = data) # creates robosave account for customer
        if (isCreated):
            return jsonify ({
                "customerDetails" : customerDetails.json(),
                "customerAccounts" : customerAccounts.json(),
                "message" : "Account has been created."
            })
        else : 
            return jsonify ({
                "message" : "WRONG"
            })
        

if __name__ == '__main__':
    app.run(port=5000, debug=True)