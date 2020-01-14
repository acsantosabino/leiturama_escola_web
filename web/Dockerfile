FROM node:10

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN npm audit fix

RUN npm install

COPY . .

COPY --chown=node:node . .

COPY ./entrypoint.sh /

RUN chmod +x /entrypoint.sh

USER node

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
