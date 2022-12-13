FROM node:18-alpine
MAINTAINER "Artur Petrov petrov0397@gmail.com"

RUN apk --no-cache upgrade && \
    apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Europe/Kiev /etc/localtime && \
    echo "Europe/Kiev" >  /etc/timezone

WORKDIR /app
COPY . .

RUN apk --no-cache add git && \
    npm i -g modclean && \
    npm i && \
    modclean -r && \
    npm uninstall modclean && \
    apk del git

ENTRYPOINT ["npm", "run", "start"]
