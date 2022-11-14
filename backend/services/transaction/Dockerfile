FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./transaction.py .
EXPOSE 5000
EXPOSE 5001
EXPOSE 5002
CMD [ "python", "./transaction.py" ]
