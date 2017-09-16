FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies as a separate layer
COPY package.json package-lock.json .
RUN npm install

# Bundle app source
COPY . .

# Expose internal port
EXPOSE 8080

CMD [ "npm", "start" ]
