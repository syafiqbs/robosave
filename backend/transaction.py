from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

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
    
    
@app.route("/getAllTransactions")
def get_all_transactions():
    transactionlist = Transaction.query.all()
    return jsonify(
        {
            "status":"sucess",
            "transaction":[transaction.json() for transaction in transactionlist]
        }
    )

if __name__ == '__main__':
    app.run(port=5000, debug=True)