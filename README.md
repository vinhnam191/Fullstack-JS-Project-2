# Storefront Backend Project
###
1. You need to install dependencies of project by using `npm i` 
2. create a postgres local name called : postgres, username: postgres , password : admin123 or you can create another user using this account.
In my case, I created new database with name called: udacity. Account I used is : username: udacityuser , password: admin123. (following by env above)

3. then, create required databases , both have the same account to login : 
    - database for dev : using SQL : CREATE DATABASE udacity;
    - database for test : using SQL : CREATE DATABASE fantasy_worlds;
4. Then do the migration by using `db-migration up` , it will help you create 4 tables that used in project. It's depend on the ENV environment variable that help you choose the data you will working on. By default , it has value "dev" that means you will work on dev database (udacity).

5. To see the testing , please run `npm run test` and review the out put of testing :
    this command will use the test database to do the testing, you can see the command set ENV variable to test in package.json.

6. To run the application with dev mode, please try with `npm run watch` will start the dev and use postman to test endpoints.
7. PORT that backend running is on localhost:3000 and db is localhost:5432
8. I do not have handler folder , all the handlers for routes are in the models folders.
9. folder middle has the authenticate method to check the token.
###
I have add one middleware for checking token in the folder middleware.
I'm using the 2 database and when you run the command db-migrate up , those databases will be created.
# Environment variable are : 
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=udacity
POSTGRES_USER=udacityuser
POSTGRES_PASSWORD=admin123
POSTGRES_DB_TEST=fantasy_worlds

BCRYPT_PASSWORD = udacity-bcrypt
SALT_ROUND= 5

SECRET_TOKEN = helloUdacity!
ENV = dev
