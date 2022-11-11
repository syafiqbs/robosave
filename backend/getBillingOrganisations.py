import requests, json
from functions import url

def getBillingOrganizations():
    serviceName = 'getBillingOrganizations'
    headerObj = {
                        'Header': {
                        'serviceName': serviceName,
                        'userID': '',
                        'PIN': '',
                        'OTP': ''
                        }
                        }
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)
    
    types = response.json()['Content']['ServiceResponse']['BillingOrgList']['BillingOrg']
    org={}
    
    for i in range(len(types)):
        billingOrg = types[i]
        org[billingOrg['BillingOrgName']]= billingOrg['AccountID']
    return org

# print(getBillingOrganizations())