FROM node:20

WORKDIR /app

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 4001

# CMD npm start
CMD [ "node", "./src/index.ts" ]
