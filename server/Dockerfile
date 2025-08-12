FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

COPY ./uploads ./uploads

RUN npx prisma generate

EXPOSE 8081

CMD ["npm", "run", "start"]
