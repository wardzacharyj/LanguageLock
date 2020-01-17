# LanguageLock
An open source micro learning application

___

### Setup
1. Install Docker + Docker Compose tooling
2. Install node_modules
```
npm i
```
2. Start Test Database
```
npm run db
```
This will spin up a mysql server on port `3306`. The username and password are just set default values of `root`. This is in no way intended to be used in a production enviroment.

3. Start Express Server
```
npm run start
```
4. Navigate to `localhost:3000/graphql` to open interactive graphql console
