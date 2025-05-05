FROM node:23-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run dev
CMD ["node", "dist/src/index.js"]