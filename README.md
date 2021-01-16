# README

## Getting Started

For Development

```
npm run dev
```

For production

```
npm start
```

## Environment Variables

We have configured [dotenv](https://www.npmjs.com/package/dotenv) preloaded in scripts commands. Thus, you will require to create `.env` file using `.env.sample` which is available in the root.<br>
You can check `package.json` file for more understanding.

**For Development**<br>
Create `.env.development` using reference of `.env.sample`

**For Production**<br>
Create `.env` using reference of `.env.sample`

Contents of `.env.sample`

```sh
# set environment - 'development' || 'production'
NODE_ENV='development'
# express listening port
PORT=8080
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER='user'
DB_PASS='pass'
DB_NAME='dbname'
```

## Deploy

-   To build tar file which can be deploy using caprover

```bash
tar --exclude='./node_modules' --exclude='./.git' --exclude='./.env.development' --exclude='./.env.production' --exclude='./.env.sample' -cvf deploy.tar .
```

-   To deploy to caprover for first time using **tar** file

```bash
caprover deploy -t deploy.tar
```

-   Redeploy for the same caprover configuration using **tar** file

```bash
caprover deploy -t deploy.tar -d
```

## References

Pincode API<br>
[http://www.postalpincode.in/](http://www.postalpincode.in/)

The Comprehensive Sequelize Cheatsheet<br>
[https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m](https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m)

Use Sequelize and Typescript like a pro! With/out the LEGACY decorators
[https://medium.com/@enetoOlveda/use-sequelize-and-typescript-like-a-pro-with-out-the-legacy-decorators-fbaabed09472](https://medium.com/@enetoOlveda/use-sequelize-and-typescript-like-a-pro-with-out-the-legacy-decorators-fbaabed09472)

How to delete a commit in git, local and remote<br>
[https://ncona.com/2011/07/how-to-delete-a-commit-in-git-local-and-remote/](https://ncona.com/2011/07/how-to-delete-a-commit-in-git-local-and-remote/)

Node.js - Role Based Authorization Tutorial with Example API
[https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api](https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api)

How to restrict access using Passport.js role-based authorisation
[https://developerhandbook.com/passport.js/passport-role-based-authorisation-authentication/](https://developerhandbook.com/passport.js/passport-role-based-authorisation-authentication/)
