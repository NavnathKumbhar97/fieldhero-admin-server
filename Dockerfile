FROM node:13.14.0
ARG DATABASE_URL=${DATABASE_URL}
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app/
RUN npm install && npm cache clean --force
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
RUN npm run prisma:deploy
RUN NODE_ENV=production npm run build
CMD [ \npm\, \start\ ]