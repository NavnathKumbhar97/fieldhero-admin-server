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
# JWT
BCRYPT_ROUNDS=random_number
JWT_SECRET_KEY='random_string'
# SMTP
SMTP_URL='smtp_url'
SMTP_HOST='smtp_host'
SMTP_EMAIL='smtp_email'
SMTP_PWD='smtp_password'
EMAIL_FROM='User <user@email.com>'
# 
SERVER_URL='http://localhost'
CLIENT_URL='http://localhost'
AGENT_PORTAL_URL=http://localhost
# Prisma - Database
DATABASE_URL=postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public
# Telegram
TELEGRAM_BOT_TOKEN=token
TELEGRAM_CHAT_ID=chatId
# for prisma seed.ts
SYSADM_NAME="User"
SYSADM_EMAIL="user@email.com"
SYSADM_CONTACT=1234512345
```

## Manual Deploy

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

Prisma Documentation<br>
[https://www.prisma.io/docs/](https://www.prisma.io/docs/)

How to delete a commit in git, local and remote<br>
[https://ncona.com/2011/07/how-to-delete-a-commit-in-git-local-and-remote/](https://ncona.com/2011/07/how-to-delete-a-commit-in-git-local-and-remote/)

Node.js - Role Based Authorization Tutorial with Example API
[https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api](https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api)

How to restrict access using Passport.js role-based authorisation
[https://developerhandbook.com/passport.js/passport-role-based-authorisation-authentication/](https://developerhandbook.com/passport.js/passport-role-based-authorisation-authentication/)

https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421

https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

https://lusbuab.medium.com/using-dotenv-with-jest-7e735b34e55f