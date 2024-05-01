# Use the official Node.js 16 image as a base
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, yarn.lock files
COPY package.json ./
COPY yarn.lock ./

RUN npm install --global yarn 

# Install dependencies using Yarn
RUN yarn 

# Copy the rest of your application code
COPY . .

# Build your NestJS application using Yarn
RUN yarn build

FROM node:20-alpine as production

WORKDIR /app
ENV NODE_ENV production

COPY package.json yarn.lock ./
COPY --from=build ./dist ./dist

RUN yarn --production

EXPOSE 5000

CMD [ "yarn", "start" ]