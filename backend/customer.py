import ctypes
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

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

@app.route("/customer/<int:customer_id>") #GET request to get a specific customer
def get_customers(customer_id):
    customer = Customer.query.filter_by(customer_id = customer_id).first()
    return jsonify(
        {
            "status":"success",
            "customer": customer.json()
        }
    )

@app.route("/customer", methods = ["POST"]) #POST request to create new customer 
def create_customer():
    data = request.get_json()
    newCustomer = Customer(**data)
    try:
        db.session.add(newCustomer)
        db.session.commit()
        return jsonify({
            "message": "success",
            "data" : newCustomer.json()
        }), 201
    except Exception:
        return jsonify({
            "message": "Unable to commit to database."
        }), 500

@app.route("/customer/update/<int:customer_id>", methods=['PUT']) # UPDATE of existing customer!
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

@app.route("/customer/delete/<int:customer_id>", methods=['DELETE']) # DELETE existing customer!
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

if __name__ == '__main__':
    app.run(port=5000, debug=True)