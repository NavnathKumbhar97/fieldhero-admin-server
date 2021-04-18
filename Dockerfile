# builder stage
FROM node:14.16.1 AS builder
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./.eslintrc ./
COPY ./nodemailer.ts ./
COPY ./prisma ./
COPY ./src ./src
RUN npm ci
RUN npm run build
# production builder stage
FROM node:14.16.1-alpine AS prod-builder
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY ./prisma ./
RUN npm ci --only=production
RUN npx prisma generate
# production stage
FROM node:14.16.1-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=prod-builder /app/node_modules ./node_modules
CMD ["npm","start"]
