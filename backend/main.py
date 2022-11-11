from flask import Flask, request, jsonify
from flask_cors import CORS
from functions import url
import requests
from invokes import invoke_http

import json

app = Flask(__name__)
CORS(app)

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
    

#Process transaction
# @app.route("/processTransaction", methods=["POST"])



if __name__ == '__main__':
    app.run(port=5000, debug=True)