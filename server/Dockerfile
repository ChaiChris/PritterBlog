FROM node:18
WORKDIR /app/server
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 8080
CMD [ "npm", "start" ]
