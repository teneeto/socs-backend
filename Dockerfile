FROM node:12.13.1-alpine
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "./"]
RUN npm install --silent
COPY . .
EXPOSE 9000
CMD [ "npm", "start" ]

