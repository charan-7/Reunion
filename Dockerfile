FROM node:18

WORKDIR /app

COPY package*.json ./

# installs all the required dependencies
RUN npm install

COPY . .

# runs all the test cases
RUN npm test

EXPOSE 5000

# runs main file
CMD [ "node", "index.js" ]