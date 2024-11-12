FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy all other files
COPY . .

# Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]