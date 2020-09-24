# README #

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
```