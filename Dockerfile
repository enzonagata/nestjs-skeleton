#builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


#Para desenvolvimento
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


#Para produção
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]

#Para teste
FROM node:20-alpine AS test
WORKDIR /app
COPY . .
COPY --from=builder /app/node_modules ./node_modules

