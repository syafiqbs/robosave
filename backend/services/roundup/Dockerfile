FROM python:3-slim
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
COPY ./roundup.py .
EXPOSE 5000
EXPOSE 5100
EXPOSE 5001
CMD [ "python", "./roundup.py" ]
