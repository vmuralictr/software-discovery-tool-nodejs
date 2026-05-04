FROM node:20-alpine

# Required to compile better-sqlite3 (native module)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Build the SQLite database from the JSON data files
RUN node scripts/buildDatabase.js

EXPOSE 5000

CMD ["node", "index.js"]
