FROM node:14-buster AS builder
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
RUN npm run build

FROM node:14-alpine3.10
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
CMD [ "npm", "run", "start:prod" ]