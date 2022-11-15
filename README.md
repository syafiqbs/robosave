
# robosave
## Backend

**WAMP / MySQL**

Start WAMP
From `robosave\backend\services`, import into the database:
```
1. customer\docker-entrypoint-initdb.d\init.sql
2. roundup\docker-entrypoint-initdb.d\init.sql
3. transaction\docker-entrypoint-initdb.d\init.sql
```
**Docker**

Start Docker Desktop
```
cd backend
docker-compose build
docker-compose up
```
## Frontend
```
cd frontend/robosave
npm install # if first time installation
npm start
```