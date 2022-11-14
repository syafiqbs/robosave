import requests, json
from functions import url, getRecord
def getProductTypes(ProductID):
    serviceName = 'getProductTypes'
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
    product = response.json()['Content']['ServiceResponse']['ProductList']['Product']
    ID_List= []
    Name_List = []
    for i in range(len(product)):
        ProductType = product[i]
        ID_List.append(ProductType['ProductID'])
        Name_List.append(ProductType['ProductName'])
    if ProductID in ID_List:
        index = ID_List.index(ProductID)
        return Name_List[index]
    else:
        return 'Record not found'
    
def getCustomerAccounts(userId, pin, otp):
    #Header
    serviceName = 'getCustomerAccounts'
    userID = userId
    PIN = pin
    OTP = otp
    
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
            print("No record found!")
        else:
            acc_list = acc_list['account']
            recordCount = getRecord(acc_list)
            if recordCount > 1:
                for i in range(0,recordCount,1):
                    account = acc_list[i]
                    acc_type = getProductTypes(account['productID'])
                    print('\nBalance: {}'.format(account['balance']))
                    print('Account ID: {}'.format(account['accountID']))
                    print('Account Open Date: {}'.format(account['accountOpenDate']))
                    print('Home Branch: {}'.format(account['homeBranch']))
                    print('Last Maintenance Officer: {}'.format(account['maintenancehistory']['lastMaintenanceOfficer']))
                    print('Last Transaction Branch: {}'.format(account['maintenancehistory']['lastTransactionBranch']))
                    print('Parent Account Flag: {}'.format(account['parentAccountFlag']))
                    print('Interest Rate: {}'.format(account['interestRate']))
                    print('Product Type: {}'.format(acc_type))
                    print('Current Status: {}'.format(account['currentStatus']))
                    print('Officer ID: {}'.format(account['officerID']))
                    print('Currency: {}'.format(account['currency']))
                return acc_list
            elif recordCount == 0:
                acc_type = getProductTypes(acc_list['productID'])
                print('Balance: {}'.format(acc_list['balance']))
                print('Account ID: {}'.format(acc_list['accountID']))
                print('Account Open Date: {}'.format(acc_list['accountOpenDate']))
                print('Home Branch: {}'.format(acc_list['homeBranch']))
                print('Last Maintenance Officer: {}'.format(acc_list['maintenancehistory']['lastMaintenanceOfficer']))
                print('Last Transaction Branch: {}'.format(acc_list['maintenancehistory']['lastTransactionBranch']))
                print('Parent Account Flag: {}'.format(acc_list['parentAccountFlag']))
                print('Interest Rate: {}'.format(acc_list['interestRate']))
                print('Product Type: {}'.format(acc_type))
                print('Current Status: {}'.format(acc_list['currentStatus']))
                print('Officer ID: {}'.format(acc_list['officerID']))
                print('Currency: {}'.format(acc_list['currency']))
            return acc_list
    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")
    else:
        print(serviceRespHeader['ErrorText'])

# getCustomerAccounts('jingyi.yeo.2020', '123456', '999999')