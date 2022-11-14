FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./billPayment.py ./functions.py ./getBillingOrganisations.py ./getCurrencyList.py ./getCustomerAccounts.py ./getCustomerDetails.py ./getCustomerStocks.py ./getStockPrice.py ./getStockSymbols.py ./invokes.py /main.py ./placeMarketOrder.py ./requestOTP.py ./sendSMS.py ./
EXPOSE 5001
EXPOSE 5002
EXPOSE 5100
CMD [ "python", "./main.py" ]
