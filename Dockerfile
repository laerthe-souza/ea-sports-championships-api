FROM node:20-slim AS development

RUN apt-get update && apt-get install -y dos2unix git

WORKDIR /home/node/app

COPY --chown=node:node start-dev.sh ./

RUN chmod +x /home/node/app/start-dev.sh
RUN dos2unix start-dev.sh

USER node

CMD [ "/home/node/app/start-dev.sh" ]

FROM node:20-alpine AS production

RUN apk add --no-cache ffmpeg

WORKDIR /home/node/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --chown=node:node . ./

RUN yarn prisma generate
RUN yarn build

RUN mkdir /home/node/app/dist/tmp
RUN chown -R node:node /home/node/app/dist
RUN chmod -R 755 /home/node/app/dist

EXPOSE 5001

USER node

CMD yarn prisma migrate deploy && yarn start:prod
