FROM node:19-alpine

RUN mkdir -p /usr/src/nuxt-app

WORKDIR /usr/src/nuxt-app

COPY package*.json .

RUN npm install

COPY . .

ARG API_URL
ENV API_URL ${API_URL}

ARG API_URL
ENV APP_URL ${API_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]