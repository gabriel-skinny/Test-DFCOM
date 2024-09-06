ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

COPY package.json ./
RUN npm i 
COPY . .
RUN npm run build
CMD npm run start:prod



