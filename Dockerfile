FROM node:12.19-alpine as buildimage

RUN apk add --no-cache --virtual .build-deps \
        python2-dev \
        gcc \ 
        g++ \
        binutils-gold \
        curl \
        gnupg \
        libgcc \
        linux-headers \
        make \
        git \
        openssl \ 
        openssh

# RUN apt-get update && apt-get upgrade -y && apt-get install -y git python make build-essential g++
RUN curl -s "https://gitlab.com/api/v4/projects/9905046/repository/files/gitlab%2Fsetup_key.sh/raw?ref=master&private_token=FjCQxPFMNXJwmaomMoKi" 2>&1 | sh

RUN ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts

RUN mkdir /srv/bombshell
WORKDIR /srv/bombshell

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install

COPY . .
RUN npm run build:prod


RUN rm -rf ./node_modules \
&& npm install \
&& npm cache clean --force \
&& rm -rf .git \
&& apk del .build-deps

FROM node:12.19-alpine

COPY --from=buildimage /srv/bombshell /srv/bombshell
WORKDIR /srv/bombshell
RUN git rev-parse HEAD > gitsha && rm -rf .git
 
ENTRYPOINT ["node", "server/index.js","--env","production"]
