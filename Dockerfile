FROM node:8

WORKDIR /usr/src/app

ADD src/package.json src/yarn.lock /usr/src/app/
RUN yarn install

COPY . /usr/src/app
