FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies as a separate layer
COPY package.json .
RUN npm install

# Environment Config
ENV NODE_ENV=production
ENV LOG_LEVEL=warn

# Bundle app source
COPY . .

# Expose internal port
EXPOSE 8080

CMD [ "npm", "start" ]
