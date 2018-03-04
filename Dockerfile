FROM node:8

WORKDIR /usr/src/app

ADD package.json yarn.lock /usr/src/app/
RUN yarn install

COPY . /usr/src/app
