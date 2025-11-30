FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
COPY prisma ./prisma
RUN npx prisma generate || true
EXPOSE 4000
CMD ["npm", "run", "dev"]
