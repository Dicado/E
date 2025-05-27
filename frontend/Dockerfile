# frontend/Dockerfile
FROM node:23-alpine@sha256:139be64e98a1374a1c49ee62b23a91f688a37a628422ff8bb9fba94185678ab3

WORKDIR /app
COPY package*.json ./
RUN sed -i '/"proxy"/d' package.json
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
