FROM node:20.19.4-bullseye-slim

WORKDIR /blogger

COPY package*.json /blogger

RUN npm i

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "--port", "4000"]