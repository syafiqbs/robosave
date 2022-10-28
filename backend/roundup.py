from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/roundup'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Roundup(db.Model):
    __table__name = "roundup"
    roundup_date = db.Column(db.DateTime, primary_key=True)
    customer_id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float, nullable=False)
    
    def __init__(self, roundup_date, customer_id, total ):
        self.roundup_date = roundup_date
        self.customer_id = customer_id
        self.total = total
    
    def json(self):
        return {"roundup_date":self.roundup_date, "customer_id":self.customer_id, "total":self.total}
    
    
@app.route("/getAllRoundups")
def get_all_roundups():
    rounduplist = Roundup.query.all()
    return jsonify(
        {
            "status":"sucess",
            "roundup":[roundup.json() for roundup in rounduplist]
        }
    )
    

if __name__ == '__main__':
    app.run(port=5000, debug=True)