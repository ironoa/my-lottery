FROM node:12.16.1-alpine3.11

WORKDIR /app

COPY . .

RUN yarn && yarn build 

ENTRYPOINT ["yarn", "start"]
