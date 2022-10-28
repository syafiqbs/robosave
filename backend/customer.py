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
    customer_name = db.Column(db.String(64), nullable=False)
    customer_bankNo = db.Column(db.Integer, nullable=False)

    def __init__(self, customer_id, customer_name, customer_bankNo):
        self.customer_id = customer_id
        self.customer_name = customer_name
        self.customer_bankNo = customer_bankNo

    def json(self):
        return {"customer_id":self.customer_id, "customer_name":self.customer_name, "customer_bankNo":self.customer_bankNo}
    
    
@app.route("/getAllCustomers")
def get_all_customers():
    customerlist = Customer.query.all()
    return jsonify(
        {
            "status":"sucess",
            "customer":[customer.json() for customer in customerlist]
        }
    )

if __name__ == '__main__':
    app.run(port=5000, debug=True)