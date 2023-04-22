FROM node:14-alpine

WORKDIR /src

COPY package*.json ./


RUN npm install


COPY . .

EXPOSE 3000


RUN apk add --no-cache redis

CMD ["sh", "-c", "redis-server & npm run start"]
