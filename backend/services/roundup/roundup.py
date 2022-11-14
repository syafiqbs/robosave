import ctypes
import json
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from datetime import datetime
import re
import os
from os import environ

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/roundup'
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)


class Roundup(db.Model):
    __table__name = "roundup"
    roundup_date = db.Column(db.String(64), primary_key=True)
    customer_id = db.Column(db.String(64), primary_key=True)
    total = db.Column(db.Float, nullable=False)

    def __init__(self, roundup_date, customer_id, total):
        self.roundup_date = roundup_date
        self.customer_id = customer_id
        self.total = total

    def json(self):
        return {"roundup_date": self.roundup_date, "customer_id": self.customer_id, "total": self.total}


@app.route("/getAllRoundups")
def get_all_roundups():
    rounduplist = Roundup.query.all()
    if rounduplist:
        return jsonify(
            {
                "status": "sucess",
                "roundup": [roundup.json() for roundup in rounduplist]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Roundup cannot be found."
        }
    ), 404


@app.route("/getRoundupById/<string:customer_id>")
def get_roundups_by_id(customer_id):
    rounduplist = Roundup.query.filter_by(customer_id=customer_id).all()
    if rounduplist:
        return jsonify(
            {
                "code": 200,
                "data": [roundup.json() for roundup in rounduplist]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Roundup cannot be found."
        }
    ), 404

@app.route("/getRoundupByMY/<string:customer_id>/<string:roundup_date>")
def get_roundups_by_id_and_date(customer_id,roundup_date):
    roundup = Roundup.query.filter_by(customer_id=customer_id, roundup_date=roundup_date).first()
    if roundup:
        return jsonify(
            {
                "code": 200,
                "data": roundup.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Roundup cannot be found."
        }
    ), 404

@app.route("/createRoundup", methods=['POST'])
def create_roundup():
    data = request.get_json()
    customer_id = data['customer_id']
    roundup_date = data['roundup_date']
    roundup_value = data['roundup_value']
    if (Roundup.query.filter_by(customer_id=customer_id, roundup_date=roundup_date).first()):
        return jsonify(
            {
                "code": 400,
                "data": {
                    "customer_id": customer_id
                },
                "message": "Roundup for customer already exists."
            }
        ), 400

    total = roundup_value
    roundup_date = data['roundup_date']
    roundup = Roundup(roundup_date, customer_id, total)

    try:
        db.session.add(roundup)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "customer_id": customer_id
                },
                "message": "An error occurred creating roundup for customer."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": roundup.json()
        }
    ), 201

@app.route("/addToRoundup/<string:customer_id>/<string:roundup_date>", methods=['PUT'])
def add_to_roundup(customer_id, roundup_date):
    roundup = Roundup.query.filter_by(customer_id=customer_id, roundup_date=roundup_date).first()
    if roundup:
        data = request.get_json()
        if data['roundup_date']:
            roundup.roundup_date = data['roundup_date']
        if data['roundup_value']:
            roundup.total += float(data['roundup_value'])
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": roundup.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "customer_id": customer_id
            },
            "message": "Customer not found."
        }
    ), 404
    
@app.route("/updateRoundup/<string:customer_id>/<string:roundup_date>", methods=['PUT'])
def update_roundup(customer_id, roundup_date):
    roundup = Roundup.query.filter_by(customer_id=customer_id, roundup_date=roundup_date).first()
    if roundup:
        data = request.get_json()
        if data['roundup_date']:
            roundup.roundup_date = data['roundup_date']
        if data['roundup_value']:
            roundup.total = float(data['roundup_value'])
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": roundup.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "customer_id": customer_id
            },
            "message": "Customer not found."
        }
    ), 404


@app.route("/deleteRoundup/<string:customer_id>/<string:roundup_date>", methods=['DELETE'])
def delete_roundup(customer_id, roundup_date):
    roundup = Roundup.query.filter_by(customer_id=customer_id, roundup_date=roundup_date).first()
    if roundup:
        db.session.delete(roundup)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": {
                    "customer_id": customer_id,
                    "message": "Customer's roundup successfully deleted."
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "customer_id": customer_id
            },
            "message": "Roundup for customer not found."
        }
    ), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    # app.run(port=5002, debug=True)
