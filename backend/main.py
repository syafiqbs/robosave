from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

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
        return {"transaction_id":self.transaction_id, "customer_id":self.customer_id, "value_before":self.value_before, "value_after":self.value_after, "value_roundup":self.value_roundup}

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

@app.route("/customer")
def get_all_customer():
    customerlist = Customer.query.all()
    return jsonify(
        {
            "status":"sucess",
            "customer":[customer.json() for customer in customerlist]
        }
    )

if __name__ == '__main__':
    app.run(port=5000, debug=True)