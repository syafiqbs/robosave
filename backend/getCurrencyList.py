import requests, json
from functions import url

def getCurrencyList(CurrencyCode):
    serviceName = 'getCurrencyList',
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

    Currency = response.json()['Content']['ServiceResponse']['CurrencyList']['Currency']

    CurrencyCodeList = []

    CountryNameList = []

    CurrencyNameList = []

   
    for i in range(len(Currency)):
        CurrencyType = Currency[i]
        CurrencyCodeList.append(CurrencyType['CurrencyCode'])
        CountryNameList.append(CurrencyType['CountryName'])
        CurrencyNameList.append(CurrencyType['CurrencyName'])

    if CurrencyCode in CurrencyCodeList:
       index = CurrencyCodeList.index(CurrencyCode)
       return CountryNameList[index], CurrencyNameList[index]

    else:
        return 'Record not found'
