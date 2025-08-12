# FROM node:19
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npx prisma generate
# EXPOSE 8080
# CMD [ "npm", "start" ]

FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
#RUN npm install
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 8081

CMD ["npm", "run", "start"]
