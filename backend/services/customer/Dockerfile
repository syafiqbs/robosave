FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./customer.py ./getCustomerTypes.py ./getProductTypes.py ./functions.py ./
EXPOSE 5100
EXPOSE 5002
EXPOSE 5000
CMD [ "python", "./customer.py" ]
